const express = require("express");
const client = require("prom-client");

const app = express();
const port = 8000;

const requestCounter = new client.Counter({
  name: "api_requests_total",
  help: "Total number of API requests",
  labelNames: ["method", "route", "status"],
});

// Create a Gauge metric for testing
const gauge = new client.Gauge({
  name: "custom_dummy_metric",
  help: "A dummy metric for testing",
  labelNames: ["type"],
});

// Simulate metric data
setInterval(() => {
  gauge.set({ type: "random" }, Math.random() * 100);
  gauge.set({ type: "fixed" }, 42);
}, 5000);

// Middleware to count requests
app.use((req, res, next) => {
  res.on("finish", () => {
    requestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

client.collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Sample routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/test", (req, res) => {
  res.send("Test Endpoint");
});

app.listen(port, () => {
  console.log(`Metrics server running on http://localhost:${port}/metrics`);
});
