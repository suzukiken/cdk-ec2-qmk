#!/usr/bin/sh

apt install --no-install-recommends -y git
apt install --no-install-recommends -y avr-libc
apt install --no-install-recommends -y avrdude
apt install --no-install-recommends -y binutils-arm-none-eabi
apt install --no-install-recommends -y binutils-avr
apt install --no-install-recommends -y build-essential
apt install --no-install-recommends -y ca-certificates
apt install --no-install-recommends -y clang-format-7
apt install --no-install-recommends -y dfu-programmer
apt install --no-install-recommends -y dfu-util
apt install --no-install-recommends -y dos2unix
apt install --no-install-recommends -y ca-certificates
apt install --no-install-recommends -y gcc
apt install --no-install-recommends -y gcc-avr
apt install --no-install-recommends -y git
apt install --no-install-recommends -y libnewlib-arm-none-eabi
apt install --no-install-recommends -y python3
apt install --no-install-recommends -y python3-pip
apt install --no-install-recommends -y software-properties-common
apt install --no-install-recommends -y tar
apt install --no-install-recommends -y unzip
apt install --no-install-recommends -y tar
apt install --no-install-recommends -y wget
apt install --no-install-recommends -y zip

# upgrade gcc-arm-none-eabi from the default 5.4.1 to 6.3.1 due to ARM runtime issues
# /bin/bash -c "set -o pipefail && \
#     wget -q https://developer.arm.com/-/media/Files/downloads/gnu-rm/6-2017q2/gcc-arm-none-eabi-6-2017-q2-update-linux.tar.bz2 -O - | tar xj --strip-components=1 -C / && \
#     rm -rf /arm-none-eabi/share/ /share/"

# Install python packages
python3 -m pip install --upgrade pip setuptools wheel
python3 -m pip install qmk

qmk setup -y -H /opt/qmk_firmware

mv /opt/qmk_firmware/keyboards/2key2crawl .
rm -Rf /opt/qmk_firmware/keyboards/*
mv 2key2crawl /opt/qmk_firmware/keyboards/
rm -Rf /opt/qmk_firmware/.git*
rm -Rf /opt/qmk_firmware/.vscode
rm -Rf /opt/qmk_firmware/api_data
rm -Rf /opt/qmk_firmware/bin
rm -Rf /opt/qmk_firmware/users/
rm -Rf /opt/qmk_firmware/.build/*
rm -Rf /opt/qmk_firmware/docs
rm -Rf /opt/qmk_firmware/nix
rm -Rf /opt/qmk_firmware/platforms
rm -Rf /opt/qmk_firmware/tests

python3 -m pip install tornado
mv tornado_server.py /opt/tornado_server.py

mv tornado.service /etc/systemd/system/tornado.service
chmod 644 /etc/systemd/system/tornado.service
systemctl daemon-reload
systemctl enable tornado.service
systemctl start tornado.service

wget https://s3.ap-northeast-1.amazonaws.com/amazoncloudwatch-agent-ap-northeast-1/debian/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i -E ./amazon-cloudwatch-agent.deb
mv amazon-cloudwatch-agent-config.json  /opt/aws/amazon-cloudwatch-agent/bin/config.json
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json -s