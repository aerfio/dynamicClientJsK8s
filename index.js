const k8s = require("@kubernetes/client-node");
const { deploymentYamlString } = require("./fixtures");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const deployObj = k8s.loadYaml(deploymentYamlString);

const k8sDynamicApi = kc.makeApiClient(k8s.KubernetesObjectApi);

(async () => {
  try {
    let data = await k8sDynamicApi.create(deployObj);
    console.log(data.body);

    try {
      // this will fail on purpose just to show the error msg
      await k8sDynamicApi.create(deployObj);
    } catch (err) {
      console.error(err.body);
    }

    deployObj.spec.replicas = 3;
    data = await k8sDynamicApi.patch(deployObj, "true");
    console.log(data.body);
  } catch (err) {
    console.error(err.body);
  }
})();
