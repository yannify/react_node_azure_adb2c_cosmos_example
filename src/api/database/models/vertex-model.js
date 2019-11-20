const Model = require('./model');

/**
* @param {string} label
* @param {object} schema
* @param {object} gorm
*/
class VertexModel extends Model {
  constructor(label, schema, gorm) {
    super(gorm, '')
    this.label = label;
    this.schema = schema;
  }

  /**
  * Creates a new vertex
  * Returns single vertex model object
  * @param {object} props
  */
  async create(props) {
    const checkSchemaResponse = this.checkSchema(this.schema, props, true);
    if (this.checkSchemaFailed(checkSchemaResponse)) {
      return checkSchemaResponse;  // TODO:  Create custom error and throw
    }
    let gremlinStr = `g.addV('${this.label}')`;
    gremlinStr += `.property('${this.g.partitionKey}', 'pk')`;  // TODO:  hardcoded partition

    gremlinStr += this.actionBuilder('property', props);
    return await this.executeQuery(gremlinStr, true);
  }

  /**
  * Creates a new edge
  * @param {object} edge
  * @param {object} props
  * @param {object} vertex
  */
  async createEdge(edgeModel, properties, vertex, bothWays = false) {
    let label, props, model;
    if (typeof edgeModel === 'string') {  // TODO:  do we want to allow this?
      label = edgeModel;
      props = properties;
      model = new this.g.edgeModel(label, {}, this.g)
    }
    else {
      label = edgeModel.label;
      props = this.parseProps(properties, edgeModel);
      model = edgeModel;
    }

    let outGremlinStr = this.getGremlinStr();
    let inGremlinStr = vertex.getGremlinStr();

    if (outGremlinStr === '') {
      throw new Error('Gremlin Query has not been initialised for out Vertex');
    }
    else if (inGremlinStr === '') {
      throw new Error('Gremlin Query has not been initialised for in Vertex');
    }
    if (typeof edgeModel !== 'string') {
      const checkSchemaResponse = this.checkSchema(edgeModel.schema, props, true);
      if (this.checkSchemaFailed(checkSchemaResponse)) {
        return checkSchemaResponse;
      }
    }

    // Remove 'g' from 'g.V()...'
    inGremlinStr = inGremlinStr.slice(1);

    const [a] = this.getRandomVariable();
    let gremlinQuery = outGremlinStr + `.as('${a}')` + inGremlinStr;
    gremlinQuery += `.addE('${label}')${this.actionBuilder('property', props)}.from('${a}')`;

    if (bothWays === true) {
      const [b] = this.getRandomVariable(1, [a]);
      let extraGremlinQuery = `${vertex.getGremlinStr()}.as('${b}')${this.getGremlinStr().slice(1)}` +
        `.addE('${label}')${this.actionBuilder('property', props)}.from('${b}')`;

      var results = await this.executeOrPass.call(model, gremlinQuery, true);
      let resultsSoFar = results.slice(0);
      var extraResults = this.executeOrPass.call(model, extraGremlinQuery, true);
      resultsSoFar = resultsSoFar.concat(results);
      return results;
    }
    else {
      return await this.executeOrPass.call(model, gremlinQuery, true);
    }
  }

  /**
  * Finds first vertex with matching properties
  * @param {object} properties
  */
  async find(properties, execute) {
    const props = this.parseProps(properties);
    let gremlinStr = `g.V(${this.getIdFromProps(props)}).hasLabel('${this.label}')` + this.actionBuilder('has', props);
    return this.executeOrPass(gremlinStr, execute, true);
  }

  /**
  * Finds all vertexes with matching properties
  * @param {object} properties
  */
  async findAll(properties, execute) {
    const props = this.parseProps(properties);
    let gremlinStr = `g.V(${this.getIdFromProps(props)}).hasLabel('${this.label}')` + this.actionBuilder('has', props);
    return this.execuexecuteOrPassteQuery(gremlinStr, execute);
  }

  /**
  * find all vertexes connected to initial vertex(es) through a type of edge with optional properties
  * @param {string} label
  * @param {object} properties
  * @param {number} depth
  */

  async findRelated(edgeModel, properties, depth, inV, execute) {
    let label, props, inModel, inLabel;
    if (typeof edgeModel === 'string') {
      label = edgeModel;
      props = properties;
    }
    else {
      label = edgeModel.label;
      props = this.parseProps(properties, edgeModel);
    }

    if (arguments.length < 4 || typeof arguments[3] === 'function') {
      inModel = this;
      inLabel = this.label;
    }
    else {
      if (typeof arguments[3] === 'string') {
        inLabel = arguments[3];
        inModel = new this.g.vertexModel(inLabel, {}, this.g);
      }
      else {
        inModel = arguments[3];
        inLabel = inModel.label;
      }
    }

    let gremlinStr = this.getGremlinStr();
    for (let i = 0; i < depth; i += 1) {
      gremlinStr += `.outE().hasLabel('${label}')${this.actionBuilder('has', props)}.inV().hasLabel('${inLabel}')`;
    }
    return await this.executeOrPass.call(inModel, gremlinStr, execute);
  }

  /**
  * find all edges connected to initial vertex(es) with matching label and optional properties
  * @param {string} label
  * @param {object} props
  * @param {number} depth
  */
  async findEdge(edgeModel, properties, execute) {
    let label, props, model;
    if (typeof edgeModel === 'string') {
      label = edgeModel;
      props = properties;
      model = new this.g.edgeModel(label, {}, this.g)
    }
    else {
      label = edgeModel.label;
      props = this.parseProps(properties, edgeModel);
      model = edgeModel;
    }
    let gremlinStr = this.getGremlinStr();
    gremlinStr += `.bothE('${label}')${this.actionBuilder('has', props)}`;
    return await this.executeOrPass.call(model, gremlinStr, execute);
  }

  /**
  * find all vertexes which have the same edge relations in that the current vertex(es) has out to another vertex
  * @param {string} label
  * @param {object} properties
  */
  async findImplicit(edgeModel, properties, execute) {
    let label, props, model;
    if (typeof edgeModel === 'string') {
      label = edgeModel;
      props = properties;
    }
    else {
      label = edgeModel.label;
      props = this.parseProps(properties, edgeModel);
    }
    let gremlinStr = this.getGremlinStr();
    let originalAs = this.getRandomVariable()[0];
    gremlinStr += `.as('${originalAs}').outE('${label}')${this.actionBuilder('has', props)}` +
      `inV().inE('${label}')${this.actionBuilder('has', props)}.outV()` +
      `.where(neq('${originalAs}'))`;
    return await this.executeOrPass(gremlinStr, execute);
  }
}

module.exports = VertexModel;