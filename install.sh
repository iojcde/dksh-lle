curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
wget "https://downloads.nestybox.com/sysbox/releases/v0.6.2/sysbox-ce_0.6.2-0.linux_arm64.deb"
sudo apt-get install jq -y
sudo apt-get install ./sysbox-ce_0.6.2-0.linux_arm64.deb -y