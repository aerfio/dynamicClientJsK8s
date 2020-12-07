const k8s = require("@kubernetes/client-node");
const { deploymentYamlString } = require("./fixtures");
const { expect } = require("chai");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sDynamicApi = kc.makeApiClient(k8s.KubernetesObjectApi);
const deployObj = k8s.loadYaml(deploymentYamlString);

describe("dummy test", function () {
  this.timeout(5000);
  it("create deployment", async function () {
    let data;
    try {
      data = await k8sDynamicApi.create(deployObj);
    } catch (error) {
      expect(JSON.stringify(error.body)).to.equal("");
    }

    expect(data.body.kind).to.equal("Deployment");

    let obj;
    try {
      obj = k8sDynamicApi.read(deployObj, "true");
    } catch (error) {
      expect(JSON.stringify(error.body)).to.equal("");
    }
    expect(obj.status).not.to.be.undefined;
  });
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
