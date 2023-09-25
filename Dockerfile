FROM ubuntu:22.04
RUN apt-get update
RUN apt-get install sudo vim build-essential gcc nano -y
CMD /bin/bash