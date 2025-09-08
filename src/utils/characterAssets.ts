import fs from "fs";
import path from "path";

export interface CharacterImage {
  src: string;
  alt: string;
  caption?: string;
  category: string;
}

export interface CharacterAssets {
  mainArtwork: CharacterImage[];
  referenceSheets: {
    front: CharacterImage | null;
    side: CharacterImage | null;
    back: CharacterImage | null;
  };
  expressionSheet: CharacterImage | null;
  poseSheet: CharacterImage | null;
  qVersionSheets: {
    front: CharacterImage | null;
    side: CharacterImage | null;
    back: CharacterImage | null;
  };
  qVersionPoses: CharacterImage[];
  costumeDesigns: CharacterImage[];
  hdArtwork: CharacterImage[];
  merchandise: CharacterImage[];
}

const CHARACTER_ASSET_PATH = path.resolve("public/assets/character");

// Helper function to create CharacterImage object
function createCharacterImage(
  filePath: string, 
  category: string, 
  customAlt?: string,
  customCaption?: string
): CharacterImage {
  const fileName = path.basename(filePath, path.extname(filePath));
  // 确保生成正确的web路径，以/开头
  const webPath = filePath.replace(path.resolve("public"), "").replace(/\\/g, "/");
  
  return {
    src: webPath.startsWith("/") ? webPath : "/" + webPath,
    alt: customAlt || fileName,
    caption: customCaption,
    category
  };
}

// Get images from a directory
function getImagesFromDirectory(dirPath: string, category: string): CharacterImage[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const imageExtensions = /\.(jpe?g|png|webp|gif)$/i;
  const files = fs.readdirSync(dirPath)
    .filter(file => imageExtensions.test(file))
    .sort();

  return files.map(file => 
    createCharacterImage(path.join(dirPath, file), category)
  );
}

// Find specific image file
function findSpecificImage(dirPath: string, namePattern: string, category: string): CharacterImage | null {
  if (!fs.existsSync(dirPath)) {
    return null;
  }

  const files = fs.readdirSync(dirPath);
  const imageExtensions = /\.(jpe?g|png|webp|gif)$/i;
  
  const matchingFile = files.find(file => 
    file.toLowerCase().includes(namePattern.toLowerCase()) && imageExtensions.test(file)
  );

  if (matchingFile) {
    return createCharacterImage(path.join(dirPath, matchingFile), category);
  }

  return null;
}

export function getCharacterAssets(): CharacterAssets {
  try {
    // 直接从character目录读取所有图片
    const allImages = getImagesFromDirectory(CHARACTER_ASSET_PATH, "character");
    
    // 按文件名分类
    const mainArtwork = allImages.filter(img => 
      img.src.includes("主设定图") || img.src.includes("头像")
    );

    const referenceSheets = {
      front: allImages.find(img => img.src.includes("三视图-up3x-denoise3x")) || null,
      side: null, // 暂时没有侧面图
      back: null  // 暂时没有背面图
    };

    const expressionSheet = allImages.find(img => 
      img.src.includes("表情sheet") && !img.src.includes("Q版")
    ) || null;

    const poseSheet = allImages.find(img => 
      img.src.includes("PoseSheet") && !img.src.includes("Q版")
    ) || null;

    const qVersionMainArt = allImages.find(img => 
      img.src.includes("Q版主设定图")
    ) || null;

    const qVersionSheets = {
      front: allImages.find(img => img.src.includes("Q版三视图")) || null,
      side: null,
      back: null
    };

    const qVersionPoses = allImages.filter(img => 
      img.src.includes("Q版") && (
        img.src.includes("pose") || 
        img.src.includes("Pose") ||
        img.src.includes("坐") ||
        img.src.includes("哭")
      ) && 
      !img.src.includes("主设定图") && 
      !img.src.includes("三视图") &&
      !img.src.includes("表情sheet") &&
      !img.src.includes("Pose-sheet")
    );

    const costumeDesigns = allImages.filter(img => 
      img.src.includes("Costume_design") || img.src.includes("服装")
    );

    const poses = allImages.filter(img => 
      (img.src.includes("站立") || img.src.includes("跪坐") || img.src.includes("蹲姿")) &&
      !img.src.includes("Q版")
    );

    const artwork3D = allImages.filter(img => 
      img.src.includes("3D模型") || img.src.includes("ZBRUSH")
    );

    const lineArt = allImages.filter(img => 
      img.src.includes("线稿")
    );

    const assets: CharacterAssets = {
      mainArtwork: mainArtwork,
      referenceSheets,
      expressionSheet,
      poseSheet,
      qVersionSheets,
      qVersionPoses,
      costumeDesigns,
      hdArtwork: [...poses, ...artwork3D, ...lineArt], // 合并到高清作品中
      merchandise: []
    };

    return assets;
  } catch (error) {
    console.error("Error loading character assets:", error);
    return {
      mainArtwork: [],
      referenceSheets: { front: null, side: null, back: null },
      expressionSheet: null,
      poseSheet: null,
      qVersionSheets: { front: null, side: null, back: null },
      qVersionPoses: [],
      costumeDesigns: [],
      hdArtwork: [],
      merchandise: []
    };
  }
}