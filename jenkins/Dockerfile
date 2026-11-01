FROM jenkins/jenkins:lts-jdk21
USER root
RUN echo "precedence ::ffff:0:0/96 100" >> /etc/gai.conf
COPY --from=docker:27-cli /usr/local/bin/docker /usr/local/bin/docker
USER jenkins
