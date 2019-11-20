/**
* @param {object} gorm
* @param {string} gremlinStr
*/
class Model {
  constructor(gorm, gremlinStr) {
    this.g = gorm;
    this.gremlinStr = gremlinStr;
    this.checkModels = false;
  }

  /**
  * Updates specific props on an existing vertex or edge
  */
  async update(props) {
    let gremlinStr = this.getGremlinStr();
    const schema = this.schema;
    const checkSchemaResponse = this.checkSchema(schema, props);
    if (this.checkSchemaFailed(checkSchemaResponse)) return checkSchemaResponse; // should it throw an error?
    gremlinStr += this.actionBuilder('property', props);
    return await this.executeOrPass(gremlinStr);
  }

  /**
  * Deletes an existing vertex or edge
  * @param {string} id id of the vertex or edge to be deleted
  */
  async delete() {
    let gremlinStr = this.getGremlinStr();
    gremlinStr += '.drop()';
    await this.executeOrPass(gremlinStr);
  }

  /**
  * Sorts query results by property in ascending/descending order
  * @param {string} propKey property to sort by.
  * @param {string} option 'ASC' or 'DESC'.
  */
  async order(propKey, option, execute) {
    if (!(option === 'DESC' || option === "ASC" )) {
      throw new Error('Order requires option to be "ASC" or "DESC"');
    }
    let originalGremlinStr = this.getGremlinStr();
    const order = originalGremlinStr.includes('order()') ? '' : '.order()';
    let gremlinStr = `${originalGremlinStr}${order}.by(`;
    const gremlinOption = option === 'DESC' ? 'decr' : 'incr';
    gremlinStr += `'${propKey}', ${gremlinOption})`;
    return await this.executeOrPass(gremlinStr, execute);
  }

  /**
  * Limits the number of results returned
  * @param {number} num number of results to be returned
  */
  async limit(num, execute) {
    let gremlinStr = this.getGremlinStr();
    gremlinStr += `.limit(${parseInt(num)})`;
    await this.executeOrPass(gremlinStr, execute);
  }

  /**
  * Takes the built query string and executes it
  * @param {string} query query string to execute.
  * @param {object} singleObject
  */
  async executeQuery(query, singleObject) {
    var result = await this.g.client.submit(query);

    let response = this.g.familiarizeAndPrototype.call(this, result);
    if(singleObject && response.length > 0) {
      return response[0];
    }
    return response;
  }

    /**
  * Executes or passes a string of command
  * @param {string} gremlinStr
  * @param {bool} execute
  * @param {object} singleObject
  */
 executeOrPass(gremlinStr, execute, singleObject) {
  if (execute) return this.executeQuery(gremlinStr, singleObject);
  let response = Object.create(this);
  response.gremlinStr = gremlinStr;
  return response;
}

  /**
  * Builds a command string to be executed or passed using props
  * @param {string} action e.g., 'has', 'property'
  * @param {object} props
  */
  actionBuilder(action, props) {
    let propsStr = '';
    let ifArr = '';
    const keys = Object.keys(props);
    keys.forEach(key => {
      if (key !== 'id') {
        if (Array.isArray(props[key])) {
          ifArr = `within(`;
          for (let i = 0; i < props[key].length; i += 1) {
            if (i === props[key].length - 1) {
              ifArr += `${this.stringifyValue(props[key][i])})`;
            } else {
              ifArr += `${this.stringifyValue(props[key][i])},`;
            }
          }
          propsStr += `.${action}('${key}',${ifArr})`;
        } else {
          propsStr += `.${action}('${key}',${this.stringifyValue(props[key])})`;
        }
      }
    });
    return propsStr;
  }

  /**
  * Attaches array methods for later use
  */
  addArrayMethods(arr) {
    if (this.constructor.name === 'VertexModel') {
      arr.createEdge = this.createEdge;
      arr.findEdge = this.findEdge;
      arr.findImplicit = this.findImplicit;
    }
    else if (this.constructor.name === 'EdgeModel') {
      arr.findVertex = this.findVertex;
    }
    arr.order = this.order;
    arr.limit = this.limit;
    arr.delete = this.delete;
    arr.actionBuilder = this.actionBuilder;
    arr.getGremlinStr = this.getGremlinStr;
    arr.getIdFromProps = this.getIdFromProps;
    arr.parseProps = this.parseProps.bind(this);
    arr.dateGetMillis = this.dateGetMillis;
    arr.getRandomVariable = this.getRandomVariable;
    arr.stringifyValue = this.stringifyValue;
    arr.checkSchema = this.checkSchema.bind(this);
    arr.checkSchemaFailed = this.checkSchemaFailed;
    arr.executeOrPass = this.executeOrPass.bind(this);
  }

  /**
  *
  */
  getGremlinStr() {
    if (this.gremlinStr && this.gremlinStr !== '') return this.gremlinStr;
    if (this.constructor.name === 'Array') {
      if (this.length === 0) return `g.V('nonexistent')`;
      let type = this[0].constructor.name.charAt(0);
      let ids = [];
      this.forEach((el) => ids.push(el.id));
      return `g.${type}("${ids.join('","')}")`;
    }
    if (this.hasOwnProperty('id')) return `g.${this.constructor.name.charAt(0)}('${this.id}')`;
    return '';
  }

  /**
  * returns the id of the vertex or edge
  */
  getIdFromProps(props) {
    let idString = '';
    if (props.hasOwnProperty('id')) {
      if (Array.isArray(props.id)) {
        idString = `'${props.id.join(',')}'`;
      } else {
        idString = `'${props.id}'`;
      }
    }
    return idString;
  }

  /**
  * Returns an array of random variables
  * @param {number} numVars desired number of variables returned
  * @param {array} currentVarsArr array of variables that already exist
  */
  getRandomVariable(numVars, currentVarsArr) {
    const variables = currentVarsArr ? Array.from(currentVarsArr) : [];
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz';
    let variablesRequired = numVars ? numVars : 1;
    function getRandomChars() {
      let result = possibleChars[Math.floor(Math.random() * possibleChars.length)];
      return result;
    }
    if (variables.length + variablesRequired > 26) {
      variablesRequired = 26 - variables.length;
    }
    for (let i = 0; i < variablesRequired; i += 1) {
      let newVariable = getRandomChars();
      while (variables.includes(newVariable)) {
        newVariable = getRandomChars();
      }
      variables.push(newVariable);
    }
    return variables;
  }

 /**
 * Parses properties into their known types from schema model
 * Will remove keys which do not exist in schema
 * @param {object} properties - properties object to parse
 * @param {object} model - model to check schema against
 */
  parseProps(properties, model) {
    let schema = model ? model.schema : this.schema;
    const props = {};
    const that = this;

    function changeTypes(key, input) {
      let value;
      switch (schema[key].type) {
        case 'number':
          value = parseFloat(input);
          if(Number.isNaN(value)) value = null;
          break;
        case 'boolean':
          if (input.toString() === 'true' || input.toString() === 'false') {
            value = input.toString() === 'true';
          } else {
            value = null;
          }
          break;
        case 'date':
          let millis = that.dateGetMillis(input);
          if (Number.isNaN(millis)) {
            millis = null;
          }
          value = millis;
          break;
        default:  //string
          value = input.toString();
      }
      return value;
    }

    Object.keys(schema).forEach((key) => {
      if (properties[key]) {
        if (Array.isArray(properties[key])) {
          props[key] = [];
          properties[key].forEach(arrValue => props[key].push(changeTypes(key, arrValue)));
        } else {
          props[key] = changeTypes(key, properties[key]);  
        }
      }
    });
    return props;
  }

  /**
  * Wraps '' around value if string and returns it
  */
  stringifyValue(value) {
    if (typeof value === 'string') {
      return `'${value}'`;
    } else {
      return `${value}`;
    }
  }

  /**
  * Checks Date types and parses it into millis
  * @param {Date/String/Number} value - number string or date representing date
  */
  dateGetMillis(value) {
    let millis = NaN;
    if (value instanceof Date) {
      millis = value.getTime();
    } else {
      const strValue = value.toString();
      const isNum = /^\d+$/.test(strValue);
      if (isNum) {
        millis = parseInt(strValue);
      } else {
        millis = Date.parse(strValue);
      }
    }
    return millis;
  }

  /**
  * Checks whether the props object adheres to the schema model specifications
  * @param {object} schema
  * @param {object} props
  * @param {boolean} checkRequired should be true for create and update methods
  */
  checkSchema(schema, props, checkRequired) {
    const schemaKeys = Object.keys(schema);
    const propsKeys = Object.keys(props);
    const response = {};

    function addErrorToResponse(key, message) {
      if (!response[key]) response[key] = [];
      response[key].push(message);
    }

    if (checkRequired) {
      for (let sKey of schemaKeys) {
        if (schema[sKey].required) {
          if (!props[sKey]) {
            addErrorToResponse(sKey, `A valid value for '${sKey}' is required`);
          }
        }
      }
    }
    for (let pKey of propsKeys) {
      if (schemaKeys.includes(pKey)) {
        if (schema[pKey].type === this.g.DATE) {
          const millis = this.dateGetMillis(props[pKey]);
          if (Number.isNaN(millis)) {
            addErrorToResponse(pKey, `'${pKey}' should be a Date`);
          } else {
            props[pKey] = millis;  //known side-effect
          }
        } else {
          if(!(typeof props[pKey] === schema[pKey].type)) {
            addErrorToResponse(pKey, `'${pKey}' should be a ${schema[pKey].type}`);
          }
        }
      } else {
        addErrorToResponse(pKey, `'${pKey}' is not part of the schema model`);
      }
    }
    return response;
  }

  /**
   * returns false if response is an empty object and true if it contains any error message
   * @param {object} response return value from checkSchema
  */
  checkSchemaFailed(response) {
    if (Object.keys(response).length === 0) return false;
    return true;
  }
}

module.exports = Model;