#include <TimdaModbus/TimdaModbus.h>

TimdaModbus::TimdaModbus()
{
    this->ct1 = init_modbus_rtu(1, UART_PORT, BAUD_RATE, PARITY, BYTESIZE, STOPBITS);
    this->ct2 = init_modbus_rtu(2, UART_PORT, BAUD_RATE, PARITY, BYTESIZE, STOPBITS);
    this->ct3 = init_modbus_rtu(3, UART_PORT, BAUD_RATE, PARITY, BYTESIZE, STOPBITS);
    this->ct4 = init_modbus_rtu(4, UART_PORT, BAUD_RATE, PARITY, BYTESIZE, STOPBITS);
}

TimdaModbus::~TimdaModbus()
{
    this->move(0, 0, 0, 0);
    int rc1 = modbus_write_register(this->ct1, 0x007D, 0x00);
    int rc2 = modbus_write_register(this->ct2, 0x007D, 0x00);
    int rc3 = modbus_write_register(this->ct3, 0x007D, 0x00);
    int rc4 = modbus_write_register(this->ct4, 0x007D, 0x00);
    modbus_close(this->ct1);
    modbus_free(this->ct1);
    modbus_close(this->ct2);
    modbus_free(this->ct2);
    modbus_close(this->ct3);
    modbus_free(this->ct3);
    modbus_close(this->ct4);
    modbus_free(this->ct4);
}

modbus_t* TimdaModbus::init_modbus_rtu(int id,
                                       std::string port,
                                       int baud_rate,
                                       char parity,
                                       int bytesize,
                                       int stop_bits)
{
    modbus_t* ct = modbus_new_rtu(port.c_str(), baud_rate, parity, bytesize, stop_bits);
    modbus_set_slave(ct, id);
    if (modbus_connect(ct) == -1) {
        fprintf(stderr, "Connection failed: %s\n", modbus_strerror(errno));
        modbus_free(ct);
        return nullptr;
    }
    std::cout << "Init success" << std::endl;
    return ct;
}

void TimdaModbus::move(int motor_1_rpm, int motor_2_rpm, int motor_3_rpm, int motor_4_rpm)
{
    int rc1 = modbus_write_register(this->ct1, 0x485, motor_1_rpm);
    int rc2 = modbus_write_register(this->ct2, 0x485, motor_2_rpm);
    int rc3 = modbus_write_register(this->ct3, 0x485, motor_3_rpm);
    int rc4 = modbus_write_register(this->ct4, 0x485, motor_4_rpm);

    // Ref pg19 in HM-5117C.pdf, 0x0A: 00000000 00001010 means FWD 1 w/ reg 2
    int rc11 = modbus_write_register(this->ct1, 0x007D, 0x0A);
    int rc22 = modbus_write_register(this->ct2, 0x007D, 0x0A);
    int rc33 = modbus_write_register(this->ct3, 0x007D, 0x0A);
    int rc44 = modbus_write_register(this->ct4, 0x007D, 0x0A);
}
