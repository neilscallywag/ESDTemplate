FROM kong/kong-gateway:2.8.4.5-alpine

USER root

ENV KONG_PLUGINS=authn-kong

COPY kong.yml /
COPY ./authn-kong /usr/local/share/lua/5.1/kong/plugins/authn-kong

USER kong
