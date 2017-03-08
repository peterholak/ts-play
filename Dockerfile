FROM node:7-slim
EXPOSE 2080
COPY dist /app
ENV TSPLAY_STORAGE /storage
VOLUME ["/storage"]
WORKDIR /app
CMD ["node","server/src/server.js"]
