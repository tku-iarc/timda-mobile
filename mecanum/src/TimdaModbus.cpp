#include <TimdaModbus/TimdaModbus.h>

TimdaModbus::TimdaModbus()
{
    this->ct = modbus_new_rtu(UART_PORT, BAUD_RATE, PARITY, BYTESIZE, STOPBITS);
    modbus_set_slave(this->ct, 1);
    if (modbus_connect(this->ct) == -1) {
        fprintf(stderr, "Connection ID '%d' failed: %s\n", 1, modbus_strerror(errno));
        modbus_free(this->ct);
    }
}

TimdaModbus::~TimdaModbus()
{
    this->move(0, 0, 0, 0);
    modbus_close(this->ct);
    modbus_free(this->ct);
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
        fprintf(stderr, "Connection ID '%d' failed: %s\n", id, modbus_strerror(errno));
        modbus_free(ct);
        return nullptr;
    }
    std::cout << "Init success" << std::endl;
    return ct;
}

void TimdaModbus::move(int motor_1_rpm, int motor_2_rpm, int motor_3_rpm, int motor_4_rpm)
{
    int mrpm_arr[4] = {motor_1_rpm, motor_2_rpm, motor_3_rpm, motor_4_rpm};
    for (int i = 1; i <=4; i++) {
        modbus_set_slave(this->ct, i);
        modbus_write_register(this->ct, 0x485, abs(mrpm_arr[i - 1]));
        if ( i % 2 == 0) {
            if (mrpm_arr[i - 1] > 0) {
                modbus_write_register(this->ct, 0x007D, 0x12);
            }else {
                modbus_write_register(this->ct, 0x007D, 0x0A);
            }
        }else {
            if (mrpm_arr[i - 1] > 0) {
                modbus_write_register(this->ct, 0x007D, 0x0A);
            }else {
                modbus_write_register(this->ct, 0x007D, 0x12);
            }
        }
    }
}

std::vector<int> TimdaModbus::read_motor_rpm()
{
    std::vector<int> mrpm;
    mrpm.clear();
    int rc;
    uint16_t tab_reg[1];
    for (int i = 1; i <= 4; i++) {
        modbus_set_slave(this->ct, i);
        rc = modbus_read_registers(this->ct, 0x00CF, 1, tab_reg);
        if (rc == -1) {
            fprintf(stderr, "%s\n", modbus_strerror(errno));
            return std::vector<int>(4, 0);
        }
        mrpm.push_back((short)tab_reg[0]);
    }
    return mrpm;
}
