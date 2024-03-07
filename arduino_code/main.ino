#include <EEPROM.h>
#include "GravityTDS.h"

#define pHSensorPin A0            //pH meter Analog output to Arduino Analog Input 0
#define TdsSensorPin A1
#define turbiditySensorPin A2
GravityTDS gravityTds;
#define samplingInterval 20
#define printInterval 800
#define ArrayLenth  40 
#define Offset 0.00;
int pHArray[ArrayLenth];   //Store the average value of the sensor feedback
int pHArrayIndex=0;

float temperature = 25,tdsValue = 0;

void setup()
{
    Serial.begin(115200);
    gravityTds.setPin(TdsSensorPin);
    gravityTds.setAref(5.0);  //reference voltage on ADC, default 5.0V on Arduino UNO
    gravityTds.setAdcRange(1024);  //1024 for 10bit ADC;4096 for 12bit ADC
    gravityTds.begin();  //initialization
    pinMode(turbiditySensorPin, INPUT);
    Serial.println("Set-up complete. Starting Readings.");
}

void loop()
{

    //temperature = readTemperature();  //add your temperature sensor and read it
    gravityTds.setTemperature(temperature);  // set the temperature and execute temperature compensation
    gravityTds.update();  //sample and calculate
    tdsValue = gravityTds.getTdsValue();  // then get the value
    Serial.print(tdsValue,0);
    Serial.println(" ppm");

    Serial.println("______________________");

    int turbidity = analogRead(A2);
    float voltage = turbidity * (5.0/1023.0);
    Serial.print(voltage);
    Serial.println (" turbidity");

    Serial.println("______________________");
    

    static unsigned long samplingTime = millis();
    static unsigned long printTime = millis();
    static float pHValue,pHvoltage;

    if(millis()-samplingTime > samplingInterval)
  {
      pHArray[pHArrayIndex++]=analogRead(pHSensorPin);
      if(pHArrayIndex==ArrayLenth)pHArrayIndex=0;
      pHvoltage = avergearray(pHArray, ArrayLenth)*5.0/1024;
      pHValue = 3.5*pHvoltage+Offset;
      samplingTime=millis();
  }
  if(millis() - printTime > printInterval)   //Every 800 milliseconds, print a numerical, convert the state of the LED indicator
  {
    // Serial.print("Voltage:");
    //     Serial.print(voltage,2);
        
    Serial.print(pHValue,2);
    Serial.println(" pH");
        printTime=millis();
  }

  Serial.println("______________________");
    delay(1000);

}

double avergearray(int* arr, int number){
  int i;
  int max,min;
  double avg;
  long amount=0;
  if(number<=0){
    Serial.println("Error number for the array to avraging!/n");
    return 0;
  }
  if(number<5){   //less than 5, calculated directly statistics
    for(i=0;i<number;i++){
      amount+=arr[i];
    }
    avg = amount/number;
    return avg;
  }else{
    if(arr[0]<arr[1]){
      min = arr[0];max=arr[1];
    }
    else{
      min=arr[1];max=arr[0];
    }
    for(i=2;i<number;i++){
      if(arr[i]<min){
        amount+=min;        //arr<min
        min=arr[i];
      }else {
        if(arr[i]>max){
          amount+=max;    //arr>max
          max=arr[i];
        }else{
          amount+=arr[i]; //min<=arr<=max
        }
      }//if
    }//for
    avg = (double)amount/(number-2);
  }//if
  return avg;
}
