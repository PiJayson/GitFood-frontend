// ScannerService.js
import Quagga from 'quagga';

const initScannerService = (element, onDetected) => {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: element,
      constraints: {
        facingMode: "environment",
      },
    },
    decoder: {
      readers: [
        "code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader",
        "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader"
      ],
    },
    locate: true,
  }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(onDetected);
};

const startScannerService = () => {
  Quagga.onDetected();
}

const stopScannerService = () => {
  Quagga.offDetected();
};

export { initScannerService, stopScannerService, startScannerService };
