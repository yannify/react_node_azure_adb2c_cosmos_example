const Model = require('./model');

/**
* @param {string} label
* @param {object} schema
* @param {object} gorm
*/
class EdgeModel extends Model {
  constructor(label, schema, gorm) {
    super(gorm, '');
    this.label = label;
    this.schema = schema;
  }

  /**
  * creates an index from out vertex(es) to the in vertex(es)
  * @param {object} outV object with properties to find 'out' vertex
  * @param {object} inV object with properties to find 'in' vertex
  * @param {object} props object containing key value pairs of properties to add on the new edge
  */
  async create(outV, inV, props, bothWays = false) {
    if (!(outV && inV)) {
      throw new Error('Need both an inV and an outV.');
    }
    const checkSchemaResponse = this.checkSchema(this.schema, props, true);
    if (this.checkSchemaFailed(checkSchemaResponse)) {
      return checkSchemaResponse;
    }

    let outGremlinStr = outV.getGremlinStr();
    let inGremlinStr = inV.getGremlinStr().slice(1);

    const [a] = this.getRandomVariable();
    let gremlinQuery = outGremlinStr + `.as('${a}')` + inGremlinStr;
    gremlinQuery += `.addE('${this.label}')${this.actionBuilder('property', props)}.from('${a}')`;

    if (bothWays === true) {
      const [b] = this.getRandomVariable(1, [a]);
      let extraGremlinQuery = `${inV.getGremlinStr()}.as('${b}')${outV.getGremlinStr().slice(1)}` +
        `.addE('${this.label}')${this.actionBuilder('property', props)}.from('${b}')`;

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
  * finds the first edge with properties matching props object
  * @param {object} props Object containing key value pairs of properties
  */
  async find(props, execute) {
    let gremlinStr = `g.E(${this.getIdFromProps(props)}).hasLabel('${this.label}')` + this.actionBuilder('has', props);
    return await this.executeOrPass(executeOrPass, execute, true);
  }

  /**
  * finds the all edges with properties matching props object
  * @param {object} props Object containing key value pairs of properties
  */
  async findAll(props, execute) {
    let gremlinStr = `g.E(${this.getIdFromProps(props)}).hasLabel('${this.label}')` + this.actionBuilder('has', props);
    return await this.executeOrPass(gremlinStr, execute);
  }

  /**
  * finds the all vertices with properties matching props object connected by the relevant edge(s)
  * @param {object} vertexModel vertexModel that corresponds to the vertex
  * @param {object} properties Object containing key value pairs of properties to find on vertices
  */
  async findVertex(vertexModel, properties, execute) {
    let label, props, model;
    if (typeof vertexModel === 'string') {
      label = vertexModel;
      props = properties;
      model = new this.g.vertexModel(label, {}, this.g)
    }
    else {
      props = this.parseProps(properties, vertexModel);
      model = vertexModel;
      label = model.label;
    }
    let gremlinStr = this.getGremlinStr();
    gremlinStr += `.bothV()${this.actionBuilder('has', props)}`;
    return await this.executeOrPass.call(model, gremlinStr, execute);
  }
}

module.exports = EdgeModel;