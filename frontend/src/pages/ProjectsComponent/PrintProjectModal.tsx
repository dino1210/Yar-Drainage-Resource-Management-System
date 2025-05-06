
const PrintModal = ({ content }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: white;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            .print-container {
              padding: 20px;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: white;
              page-break-before: always;
            }

            @media print {
              body {
                width: 100%;
                height: 100%;
                margin: 0;
              }
              .print-container {
                padding: 40px;
                width: 100%;
                height: 100%;
                display: block;
                overflow: visible;
              }
              .print-container button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${content}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="absolute top-2 left-3">
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Print
      </button>
    </div>
  );
};

export default PrintModal;
