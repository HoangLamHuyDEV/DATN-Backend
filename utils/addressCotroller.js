const AddressRepository = require ("../repositories/addressRepository");

class AddressController {
  static async getAllProvines(req, res) {
    try {
      const provines = await AddressRepository.GetAllProvines();
      res.status(200).json(provines);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh:", error);
      res.status(500).json({ message: "Lỗi server khi lấy tỉnh" });
    }
  }

  static async getDistrictsByProvinceId(req, res) {
    const { province_id } = req.params;
    try {
      const districts = await AddressRepository.GetAllDistrictsByProvinceId(province_id);
      res.status(200).json(districts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách huyện:", error);
      res.status(500).json({ message: "Lỗi server khi lấy huyện" });
    }
  }

  static async getWardsByDistrictId(req, res) {
    const { district_id } = req.params;
    try {
      const wards = await AddressRepository.GetAllWardByDistrictId(district_id);
      res.status(200).json(wards);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xã/phường:", error);
      res.status(500).json({ message: "Lỗi server khi lấy xã/phường" });
    }
  }
}

module.exports = AddressController;
