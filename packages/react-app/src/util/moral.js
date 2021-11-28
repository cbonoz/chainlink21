import Moralis from "moralis";
const Property = Moralis.Object.extend("Property");

export const saveProperty = async prop => {
  delete prop["id"];
  const keys = Object.keys(prop);

  const obj = new Property();
  keys.forEach(k => {
    obj.save(k, prop[k]);
  });
  console.log("save", prop);
  return await obj.save();
};

// https://docs.moralis.io/moralis-server/database/queries
export const getProperty = async cid => {
  const query = new Moralis.Query(Property);
  query.equalTo("cid", cid);
  const results = await query.find();
  return results;
};

export const getProperties = async (skip, limit) => {
  limit = limit || 25;
  skip = skip || 0;

  const query = new Moralis.Query(Property);
  query.skip(skip);
  query.withCount();
  const { results } = await query.find();
  const properties = results.map(x => x.attributes);
  console.log("properties", properties);
  return properties;
};
