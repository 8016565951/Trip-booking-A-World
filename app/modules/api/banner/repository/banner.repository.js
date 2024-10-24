const banner = require("../model/banner");
const mongoose = require("mongoose");

class BannerRepository {
    createBanner = async (data) => {
        try {
            const bannerData = await banner.create(data);
            return bannerData;
        } catch (error) {
            return error;
        }
    };

    getBanner = async () => {
        try {
            const bannerData = await banner.find();
            return bannerData;
        } catch (error) {
            return error;
        }
    };

    getBannerById = async (id) => {
        try {
            const bannerData = await banner.findById(id);
            return bannerData;
        } catch (error) {
            return error;
        }
    };
    updateBanner = async (id, data) => {
        try {
            const bannerData = await banner.findByIdAndUpdate(id, data);
            return bannerData;
        } catch (error) {
            return error;
        }
    };

    deleteBanner = async (id) => {
        try {
            const bannerData = await banner.findByIdAndDelete(id);
            return bannerData;
        } catch (error) {
            return error;
        }
    };
}

module.exports = new BannerRepository();
