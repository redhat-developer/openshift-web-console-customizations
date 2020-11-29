#!/bin/bash
echo "#####################################################"
echo -e "########## \033[1;94mReverting Console Customization\033[0m ##########"
echo "#####################################################"
echo -e "# \033[1;91mTASK 1\033[0m: Removing temporary directory and files"
rm -rf /tmp/script_dir/ &> /dev/null
rmdir /tmp/script_dir &> /dev/null
echo -e "# \033[1mTASK 1\033[0m: \033[1;92mCompleted\033[0m"
echo "###################"
echo -e "# \033[1;91mTASK 2\033[0m: Removing custom logo and product name"
oc delete configmap console-custom-logo -n openshift-config &> /dev/null
echo -e "\u2714 Deleted config map"
oc patch console.operator.openshift.io cluster --type json -p '[{ "op": "remove", "path": "/spec/customization" }]' &> /dev/null
echo -e "\u2714 Patched the web console’s operator configuration"
echo -e "# \033[1mTASK 2: \033[1;92mCompleted\033[0m"
echo "###################"
echo -e "# \033[1;91mTASK 3\033[0m: Removing custom links in the web console"
oc delete ConsoleLink latest-ocp-release rh-cve-db contact-rh change-password contact-it-team my-subscriptions connect namespaced-dashboard-link-for-all-namespaces namespaced-dashboard-for-some-namespaces &> /dev/null
echo -e "# \033[1mTASK 3: \033[1;92mCompleted\033[0m"
echo "###################"
echo -e "# \033[1;91mTASK 4\033[0m: Removing test namespaces (sample-namespace and test-namespace)"
oc delete project sample-namespace test-namespace &> /dev/null
echo -e "# \033[1mTASK 4: \033[1;92mCompleted\033[0m"
echo "###################"
echo -e "# \033[1;91mTASK 5\033[0m: Removing custom login/IdP selection page"
oc delete secret providers-template -n openshift-config &> /dev/null
echo -e "\u2714 Deleted providers-template secret"
oc delete secret login-template -n openshift-config &> /dev/null
echo -e "\u2714 Deleted login-template secret"
oc patch oauths cluster --type json -p '[{ "op": "remove", "path": "/spec/templates" }]' &> /dev/null
echo -e "\u2714 Patched authentication configuration"
echo -e "# \033[1mTASK 5: \033[1;92mCompleted\033[0m"
echo "###################"
echo -e "# \033[1;91mTASK 6\033[0m: Removing custom notification banners"
oc delete ConsoleNotification banner-top banner-bottom &> /dev/null
echo -e "# \033[1mTASK 6: \033[1;92mCompleted\033[0m"
echo "###################"
echo -e "# \033[1;91mTASK 7\033[0m: Removing customized CLI downloads"
oc delete ConsoleCLIDownload github-cli &> /dev/null
echo -e "# \033[1mTASK 7: \033[1;92mCompleted\033[0m"
echo "###################"
echo -e "# \033[1;91mTASK 8\033[0m: Removing YAML examples from Kubernetes resources"
oc delete ConsoleYAMLSample secret-yaml-sample configmap-yaml-sample &> /dev/null
echo -e "# \033[1mTASK 8: \033[1;92mCompleted\033[0m"
echo "####################################################"
echo -e "########## \033[1;94mConsole Customization Reverted\033[0m ##########"
echo "####################################################"
echo -e "Console URL - \033[1;94mhttps://$(oc get route console -n openshift-console -o 'custom-columns=NAME:spec.host' --no-headers)\033[0m"
