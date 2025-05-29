import * as service from "../service/ecoOptionService.js";

export const getDocumentByPropertyToken = async (req, res) => {
    const { propertyToken } = req.params;
    const {itemType} = req.body;

    try {
        const result = await service.findDocumentIdByPropertyToken(propertyToken, itemType);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message || "Document not found",
        });
    }
};