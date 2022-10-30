import express from "express";

async function main() {
  const app = express();
  app.use(express.json());
  
  app.listen(8003, () => { console.log(`Server has started on port ${8003}`) })
}

main();