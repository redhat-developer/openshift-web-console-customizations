# Matrix-style dripping text login screen

This customization will change the standard Red Hat OpenShift Container Platform login screen to one that is styled similarly to **The Matrix** movie's iconic dripping text.

![Login Screen](matrix-login.gif)

*(MP4 video screen capture also available in this directory)*

## Installation

1. Clone the source down to your local terminal
2. Log into your OpenShift cluster with `cluster-admin` privileges (such as with kubeadmin) via the CLI
3. Create a secret from the `login.html` file: `oc create secret generic matrix-login-template --from-file=login.html -n openshift-config`
4. Modify the oauth.cluster configuration with `oc edit oauths cluster`
5. Set the following to the `.spec` :

```yaml
spec:
  templates:
    login:
        name: matrix-login-template
```

6. Save the configuration and wait a couple minutes while the OAuth operator reloads with the new login screen
