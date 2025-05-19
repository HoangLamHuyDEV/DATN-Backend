const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const libre = require("libreoffice-convert");

class PDFController {
  async generateInvoicePdf(billData, res) {
    try {
      const templatePath = path.resolve(__dirname, "../templates/invoice_template.docx");
      const content = fs.readFileSync(templatePath, "binary");
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const data = {
        ngay: billData.ngay,
        thang: billData.thang,
        nam: billData.nam,
        tennguoimua: billData.customer_name,
        diachi: billData.customer_address,
        sdt: billData.customer_phone,
        pttt: billData.payment_method === "cod" ? "Thanh toán trực tiếp" : billData.payment_method,
        thanhtien: billData.total_price.toLocaleString("vi-VN") + " ₫",
        thanhtienchu: this.numberToVietnameseWords(billData.total_price),
        items: billData.items.map((item, index) => ({
          stt: index + 1,
          Tensp: item.product_name,
          soluong: item.quantity,
          dongia: item.price.toLocaleString("vi-VN"),
          thanhtien: (item.price * item.quantity).toLocaleString("vi-VN"),
        })),
      };

      doc.render(data);
      const docxBuffer = doc.getZip().generate({ type: "nodebuffer" });

      // Chuyển sang PDF
      libre.convert(docxBuffer, ".pdf", undefined, (err, pdfBuffer) => {
        if (err) {
          console.error("Lỗi chuyển sang PDF:", err);
          return res.status(500).json({ error: "Không thể tạo PDF" });
        }

        res.setHeader("Content-Disposition", `attachment; filename=hoa_don_${billData.id}.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdfBuffer);
      });

    } catch (err) {
        if (err.properties && err.properties.errors instanceof Array) {
          console.log('Template errors:');
          err.properties.errors.forEach((e, i) => {
            console.log(`${i + 1}. ${e.properties.explanation}`);
          });
        }
        console.error('Lỗi tạo hóa đơn:', err);
        res.status(500).json({ error: 'Không thể tạo hóa đơn' });
      }
      
  }

  numberToVietnameseWords(number) {
    return `${number.toLocaleString("vi-VN")} đồng`;
  }
}

module.exports = new PDFController();
