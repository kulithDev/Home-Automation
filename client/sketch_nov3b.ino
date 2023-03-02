#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>

#include "DHT.h"

#define DHTPIN 4     

#define DHTTYPE DHT11   // DHT 11

/*Put your SSID & Password*/
const char *ssid = "Galaxy";           // Enter SSID here
const char *password = "kvakvakva"; // Enter Password here

WebServer server(80);
DHT dht(DHTPIN, DHTTYPE);

void handle_OnConnect()
{
  Serial.println("/");
  server.send(200, "text/plain", "Connected");
}

void handleMainLightOn()
{
  Serial.println("/main_light/on");
  server.send(200, "text/plain", "On");
  digitalWrite(26, HIGH); 
}

void handleMainLightOff()
{
  Serial.println("/main_light/off");
  server.send(200, "text/plain", "Off");
  digitalWrite(26, LOW);
}

void handleNightLightOn()
{
  Serial.println("/night_light/on");
  server.send(200, "text/plain", "On");
  digitalWrite(27, HIGH); 
}

void handleNightLightOff()
{
  Serial.println("/night_light/off");
  server.send(200, "text/plain", "Off");
  digitalWrite(27, LOW);
}

void handleDHT()
{
  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  String humidity = String(h);
  String temperature = String(t);
  String dataString = String(temperature + "-" +humidity);
  // Serial.println(h);
  // Serial.println(t);
  Serial.println(dataString);
  server.send(200, "text/plain", dataString);
}

void handle_NotFound()
{
  server.send(404, "text/plain", "Resource Path Does Not Exist");
}


void setup()
{
  Serial.begin(115200);
  dht.begin();

  delay(100);

  pinMode(26, OUTPUT);
  pinMode(27, OUTPUT);
  Serial.println("Connecting to ");
  Serial.println(ssid);

  // connect to your local wi-fi network
  WiFi.begin(ssid, password);

  // check wi-fi is connected to wi-fi network
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");
  Serial.print("Got IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handle_OnConnect);
  server.on("/main_light/on", handleMainLightOn);
  server.on("/main_light/off", handleMainLightOff);
  server.on("/night_light/on", handleNightLightOn);
  server.on("/night_light/off", handleNightLightOff);
  server.on("/get_dht", handleDHT);
  server.onNotFound(handle_NotFound);

  server.enableCORS();
  server.begin();
  Serial.println("HTTP server started");
}

void loop()
{
  server.handleClient();
  
}
