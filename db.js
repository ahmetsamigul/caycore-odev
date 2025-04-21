import rethinkdbdash from "rethinkdbdash";

const r = rethinkdbdash({ db: "sami" });

const setup = async () => {
  const dbList = await r.dbList();
  if (!dbList.includes("sami")) {
    await r.dbCreate("sami");
  }

  const tableList = await r.db("sami").tableList();
  if (!tableList.includes("users")) {
    await r.db("sami").tableCreate("users");
  }
};

await setup();

export default r;
