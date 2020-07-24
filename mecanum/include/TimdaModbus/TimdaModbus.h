#include <errno.h>
#include <iostream>
#include <modbus/modbus.h>

#define Motor1_ID 1
#define Motor2_ID 2
#define Motor3_ID 3
#define Motor4_ID 4
#define UART_PORT "/dev/ttyUSB0"
#define BAUD_RATE 9600
#define PARITY 'E' // Even (Odd, None)
#define BYTESIZE 8
#define STOPBITS 1

class TimdaModbus
{
    modbus_t *ct = nullptr;
    modbus_t *ct1 = nullptr;
    modbus_t *ct2 = nullptr;
    modbus_t *ct3 = nullptr;
    modbus_t *ct4 = nullptr;

public:
    TimdaModbus();
    ~TimdaModbus();
    void move(int motor_1_rpm, int motor_2_rpm, int motor_3_rpm, int motor_4_rpm);

private:
    modbus_t* init_modbus_rtu(int id,
                              std::string port,
                              int baud_rate,
                              char parity,
                              int bytesize,
                              int stop_bits);
};
