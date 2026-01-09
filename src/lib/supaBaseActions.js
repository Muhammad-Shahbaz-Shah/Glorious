import { supabase } from "./supabaseClient";
export const storeFile = async (files) => {
  if (!files) return;
  try {
    const upload = async (file) => {
      const fileName = `${Date.now()}-${file.name}`;
      console.log(
        "📤 Uploading to Supabase - Bucket: 'images', Path:",
        fileName
      );
      
      const fileBody = file.body || file;
      const options = file.type ? { contentType: file.type } : undefined;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, fileBody, options);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    };
    if (Array.isArray(files)) {
      const urls = await Promise.all(files.map((f) => upload(f)));
      console.log("✅ Uploaded files:", urls);
      return urls;
    } else {
      const url = await upload(files);
      console.log("✅ Upload complete - Public URL:", url);
      return url;
    }
  } catch (error) {
    console.error("❌ Upload error:", error);
    throw error;
  }
};

export const deleteFile = async (urls) => {
  if (!urls) return;
  try {
    const extractPath = (url) => {
      let filePath;
      if (url.includes("/images/")) {
        const parts = url.split("/images/");
        filePath = parts.pop();
      } else {
        const urlParts = url.split("/");
        filePath = urlParts.pop();
      }
      return decodeURIComponent(filePath).trim();
    };

    const paths = Array.isArray(urls)
      ? urls.map(extractPath)
      : [extractPath(urls)];

    const { data, error } = await supabase.storage.from("images").remove(paths);
    if (error) {
      console.error("❌ Supabase delete error:", error);
      throw error;
    }
    console.log("✅ File(s) deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Delete error:", error.message);
    throw error;
  }
};
