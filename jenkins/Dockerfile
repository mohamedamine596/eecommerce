FROM jenkins/jenkins:lts-jdk21
USER root
COPY --from=docker:27-cli /usr/local/bin/docker /usr/local/bin/docker
USER jenkins
