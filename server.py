import requests
import serial

ser = serial.Serial('/dev/tty.usbmodem1412', 19200, timeout=1)
ser.readline()

while True:
    line = ser.readline().replace('\n', '')
    print line
    if not line:
        continue
    fields = line.split(',')
    url = 'https://api.thingspeak.com/update?api_key=D6QJVBI8TE96ONRK'
    for i, field in enumerate(fields):
        print '\t', field
        url += '&field{0}={1}'.format(i + 1, field)
    print url
    requests.get(url)
    print '\n'

ser.close()
