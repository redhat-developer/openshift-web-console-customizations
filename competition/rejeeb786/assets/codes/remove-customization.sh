#!/bin/bash
echo "#####################################################"
echo "########## Reverting Console Customization ##########"
echo "#####################################################"
echo "# TASK 1: Removing temporary directory and files"
rm -rf /tmp/script_dir/ &> /dev/null
rmdir /tmp/script_dir &> /dev/null
echo "# TASK 1: Completed"
echo "###################"
echo "# TASK 2: Removing custom logo and product name"
oc delete configmap console-custom-logo -n openshift-config &> /dev/null
echo -e "\u2714 Deleted config map"
oc patch console.operator.openshift.io cluster --type json -p '[{ "op": "remove", "path": "/spec/customization" }]' &> /dev/null
echo -e "\u2714 Patched the web console’s operator configuration"
echo "# TASK 2: Completed"
echo "###################"
echo "# TASK 3: Removing custom links in the web console"
oc delete ConsoleLink latest-ocp-release rh-cve-db contact-rh change-password contact-it-team my-subscriptions connect namespaced-dashboard-link-for-all-namespaces namespaced-dashboard-for-some-namespaces &> /dev/null
echo "# TASK 3: Completed"
echo "###################"
echo "# TASK 4: Removing test namespaces (sample-namespace and test-namespace)"
oc delete project sample-namespace test-namespace &> /dev/null
echo "# TASK 4: Completed"
echo "###################"
echo "# TASK 5: Removing custom login/IdP selection page"
oc delete secret providers-template -n openshift-config &> /dev/null
echo -e "\u2714 Deleted providers-template secret"
oc delete secret login-template -n openshift-config &> /dev/null
echo -e "\u2714 Deleted login-template secret"
oc patch oauths cluster --type json -p '[{ "op": "remove", "path": "/spec/templates" }]' &> /dev/null
echo -e "\u2714 Patched authentication configuration"
echo "# TASK 5: Completed"
echo "###################"
echo "# TASK 6: Removing custom notification banners"
oc delete ConsoleNotification banner-top banner-bottom &> /dev/null
echo "# TASK 6: Completed"
echo "###################"
echo "# TASK 7: Removing customized CLI downloads"
oc delete ConsoleCLIDownload github-cli &> /dev/null
echo "# TASK 7: Completed"
echo "###################"
echo "# TASK 8: Removing YAML examples from Kubernetes resources"
oc delete ConsoleYAMLSample secret-yaml-sample configmap-yaml-sample &> /dev/null
echo "# TASK 8: Completed"
echo "####################################################"
echo "########## Console Customization Reverted ##########"
echo "####################################################"
