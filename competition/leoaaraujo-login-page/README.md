# Openshift Login Page Custom


### To configure the custom page login in your Openshift, follow the steps below

- Create a new secret in openshift-config project:

```shell
oc create secret generic login-template --from-file=login.html -n openshift-config
```

- After that, execute the command below to edit ***oauths cluster***
```shell
oc edit oauths cluster
```

- Add this lines:
```yaml
spec:
  templates:
    login:
      name: login-template or secret-name
```

![Openshift Console Login](images/ocp-console-custom.png)


### To configure the custom provider page in your Openshift, follow the steps below

- Create a new secret in openshift-config project:

```shell
oc create secret generic providers-template --from-file=providers.html -n openshift-config
```

- After that, execute the command below to edit ***oauths cluster***
```shell
oc edit oauths cluster
```

- Add this lines:
```yaml
spec:
  templates:
    login:
      name: login-template
    providerSelection:
      name: providers-template
```

![Openshift Provider Select](images/ocp-provider-custom-01.png)
![Openshift Provider Select](images/ocp-provider-custom-02.png)

