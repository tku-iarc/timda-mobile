/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp-now-many-to-one-esp8266-nodemcu/
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/

#include <ESP8266WiFi.h>
#include <espnow.h>

const int output = 2;
const int buttonPin = 4;
int testvariable = 0;

int ledState = LOW;          // the current state of the output pin
int buttonState;             // the current reading from the input pin
int lastButtonState = LOW;   // the previous reading from the input pin
unsigned long lastDebounceTime = 0;  // the last time the output pin was toggled
unsigned long debounceDelay = 50;    // the debounce time; increase if the output flickers

// REPLACE WITH RECEIVER MAC Address
uint8_t broadcastAddress[] = {0x10, 0x52, 0x1C, 0xE9, 0x48, 0xE2};

// Set your Board ID (ESP32 Sender #1 = BOARD_ID 1, ESP32 Sender #2 = BOARD_ID 2, etc)
#define BOARD_ID 2

// Structure example to send data
// Must match the receiver structure
typedef struct struct_message {
    int id;
    int send_data;
} struct_message;

// Create a struct_message called test to store variables to be sent
struct_message myData;

unsigned long lastTime = 0;
unsigned long timerDelay = 10000;

// Callback when data is sent
void OnDataSent(uint8_t *mac_addr, uint8_t sendStatus) {
  Serial.print("\r\nLast Packet Send Status: ");
  if (sendStatus == 0){
    Serial.println("Delivery success");
  }
  else{
    Serial.println("Delivery fail");
  }
}
 
void setup() {
  // Init Serial Monitor
  Serial.begin(115200);
 
  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  // Init ESP-NOW
  if (esp_now_init() != 0) {
    Serial.println("Error initializing ESP-NOW");
    return;
  } 
  // Set ESP-NOW role
  esp_now_set_self_role(ESP_NOW_ROLE_CONTROLLER);

  // Once ESPNow is successfully init, we will register for Send CB to
  // get the status of Trasnmitted packet
  esp_now_register_send_cb(OnDataSent);
  
  // Register peer
  esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_SLAVE, 1, NULL, 0);
  
  pinMode(output, OUTPUT);
  digitalWrite(output, LOW);
  pinMode(buttonPin, INPUT);
}
 
void loop() {
    int reading = digitalRead(buttonPin);

    if (reading != lastButtonState) 
    {
      // reset the debouncing timer
      lastDebounceTime = millis();
    }

    if ((millis() - lastDebounceTime) > debounceDelay) 
    {
    // whatever the reading is at, it's been there for longer than the debounce
    // delay, so take it as the actual current state:

    // if the button state has changed:
      if (reading != buttonState) 
      {
        buttonState = reading;

      // only toggle the LED if the new button state is HIGH
        if (buttonState == HIGH) 
        {
          ledState = !ledState;
          digitalWrite(output, ledState);
          
          myData.id = BOARD_ID;
          myData.send_data = 1;
          // Send message via ESP-NOW
          esp_now_send(0, (uint8_t *) &myData, sizeof(myData));
        }
      }
    }  
    
    lastButtonState = reading;
    ledState = lastButtonState;
    digitalWrite(output, ledState);
    
  }
