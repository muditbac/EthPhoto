### Installation Dependencies

## Installing Geth
sudo apt-get install software-properties-common
sudo -E add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum

# Installing IPFS
wget https://dist.ipfs.io/go-ipfs/v0.4.8/go-ipfs_v0.4.8_linux-amd64.tar.gz
tar xvfz go-ipfs_v0.4.8_linux-amd64.tar.gz
mv go-ipfs/ipfs /usr/local/bin/ipfs


# Installing Nodejs, also installs Node Package Manager (npm)
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installing Chrome
# sudo dpkg -i google-chrome-stable_current_amd64.deb; sudo apt-get -f install
