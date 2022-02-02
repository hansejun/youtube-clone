import Video from "../../models/Video";

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.sendStatus(400);
    }
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
  };