FROM kong/kong-gateway:2.8.4.5-alpine
USER root

ENV KONG_PLUGINS=authn-kong

COPY kong.yml /
COPY ./authn-kong /usr/local/share/lua/5.1/kong/plugins/authn-kong
# COPY certs /etc/kong/ssl

USER kong

RUN cp ./kong.conf.default /etc/kong/kong.conf