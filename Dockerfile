FROM ubuntu:22.04
RUN adduser  --disabled-password --shell /bin/bash ubuntu
RUN usermod -aG sudo ubuntu

RUN apt-get update
RUN apt-get install sudo vim build-essential gcc nano -y

RUN touch /home/ubuntu/.sudo_as_admin_successful
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers


USER ubuntu
CMD /bin/bash
WORKDIR /home/ubuntu

RUN echo "echo DKSH LLE에 오신 것을 환영합니다! \n" >> ~/.bashrc
RUN echo "echo PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin" >> ~/.bashrc