const plants = [
  {
    id: "tomato",
    name: "Tomato",
    image: require("../../assets/images/tomato.jpg"),

    description:
      "Tomato is a common crop that can have fungal, bacterial and viral diseases.",

    info: {
      planting: "Spring",
      watering: "Regular",
      height: "60 - 200cm",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/corn2.jpg"),
      require("../../assets/images/corn3.jpg"),
    ],

    diseases: [
      {
        id: "tomato_bacterial_spot",
        name: "Bacterial Spot",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Bacterial spot affects tomato leaves.",
        symptoms: "Small dark spots appear on the leaves.",
        treatment: "Avoid wetting leaves and remove infected parts.",
      },
      {
        id: "tomato_early_blight",
        name: "Early Blight",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Early blight usually starts on older tomato leaves.",
        symptoms: "Brown spots with circular ring patterns appear.",
        treatment: "Remove infected leaves and improve air flow.",
      },
      {
        id: "tomato_late_blight",
        name: "Late Blight",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Late blight spreads fast in wet weather.",
        symptoms: "Dark wet-looking spots appear on leaves and stems.",
        treatment: "Remove infected plants and avoid wet leaves.",
      },
      {
        id: "tomato_leaf_mold",
        name: "Leaf Mold",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Leaf mold usually appears in humid places.",
        symptoms: "Yellow spots and mold can appear on leaves.",
        treatment: "Improve air circulation and reduce humidity.",
      },
      {
        id: "tomato_septoria_leaf_spot",
        name: "Septoria Leaf Spot",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Septoria leaf spot creates many small spots.",
        symptoms: "Small round spots with dark edges appear on leaves.",
        treatment: "Remove infected leaves and avoid overhead watering.",
      },
      {
        id: "tomato_spider_mites",
        name: "Spider Mites",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Spider mites are tiny pests that damage tomato leaves.",
        symptoms: "Leaves may look yellow, dry or dusty.",
        treatment: "Wash leaves gently and use mite control if needed.",
      },
      {
        id: "tomato_target_spot",
        name: "Target Spot",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Target spot causes circular spots on tomato leaves.",
        symptoms: "Brown circular spots may appear with target-like rings.",
        treatment: "Remove infected leaves and improve airflow.",
      },
      {
        id: "tomato_yellow_leaf_curl_virus",
        name: "Yellow Leaf Curl Virus",
        images: [require("../../assets/images/corn2.jpg")],
        description: "This virus affects tomato growth.",
        symptoms: "Leaves curl upward and turn yellow.",
        treatment: "Control whiteflies and remove infected plants.",
      },
      {
        id: "tomato_mosaic_virus",
        name: "Tomato Mosaic Virus",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Tomato mosaic virus causes leaf color changes.",
        symptoms: "Leaves show light and dark green mosaic patterns.",
        treatment: "Remove infected plants and disinfect tools.",
      },
      {
        id: "tomato_healthy",
        name: "Healthy",
        images: [require("../../assets/images/corn2.jpg")],
        description: "The tomato leaf looks healthy.",
        symptoms: "Green and clean leaves without disease symptoms.",
        treatment: "Continue normal care and check the plant regularly.",
      },
    ],
  },

  {
    id: "corn",
    name: "Corn",
    image: require("../../assets/images/corn.jpg"),

    description:
      "Corn is a warm-season crop that requires sunlight and regular watering.",

    info: {
      planting: "Spring",
      watering: "2-3 times/week",
      height: "1.5 - 3m",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/corn2.jpg"),
      require("../../assets/images/corn3.jpg"),
    ],

    diseases: [
      {
        id: "corn_gray_leaf_spot",
        name: "Gray Leaf Spot",
        images: [require("../../assets/images/corn2.jpg")],
        description: "A fungal disease that creates gray lesions on leaves.",
        symptoms: "Rectangular gray spots appear on leaves.",
        treatment: "Use fungicides and resistant hybrids.",
      },
      {
        id: "corn_leaf_blight",
        name: "Leaf Blight",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Causes long brown lesions on leaves.",
        symptoms: "Long brown spots and drying leaves.",
        treatment: "Crop rotation and fungicide use.",
      },
      {
        id: "corn_rust_leaf",
        name: "Common Rust",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Fungal disease with reddish pustules.",
        symptoms: "Small red/orange bumps on leaves.",
        treatment: "Use resistant varieties.",
      },
    ],
  },

  {
    id: "pepper",
    name: "Pepper",
    image: require("../../assets/images/pepper.jpg"),

    description:
      "Pepper is a warm-season plant that needs sunlight and regular watering.",

    info: {
      planting: "Spring",
      watering: "2-3 times/week",
      height: "40 - 90cm",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/corn2.jpg"),
      require("../../assets/images/corn3.jpg"),
    ],

    diseases: [
      {
        id: "pepper_bacterial_spot",
        name: "Bacterial Spot",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Bacterial spot affects pepper leaves and fruit.",
        symptoms: "Small dark spots appear on leaves. Leaves may turn yellow.",
        treatment:
          "Avoid watering leaves directly and remove infected leaves.",
      },
      {
        id: "pepper_healthy",
        name: "Healthy",
        images: [require("../../assets/images/corn2.jpg")],
        description: "The pepper leaf looks healthy.",
        symptoms: "Green and clean leaves without visible disease spots.",
        treatment: "Continue normal care and check the plant regularly.",
      },
    ],
  },

  {
    id: "potato",
    name: "Potato",
    image: require("../../assets/images/potato.jpg"),

    description:
      "Potato is an important crop that can be affected by leaf diseases.",

    info: {
      planting: "Spring",
      watering: "Moderate",
      height: "30 - 100cm",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/corn2.jpg"),
      require("../../assets/images/corn3.jpg"),
    ],

    diseases: [
      {
        id: "potato_early_blight",
        name: "Early Blight",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Early blight is a fungal disease on potato leaves.",
        symptoms: "Brown spots with ring-like patterns appear on older leaves.",
        treatment: "Remove infected leaves and use crop rotation.",
      },
      {
        id: "potato_late_blight",
        name: "Late Blight",
        images: [require("../../assets/images/corn2.jpg")],
        description: "Late blight is a serious potato disease.",
        symptoms: "Dark wet-looking spots appear on leaves.",
        treatment: "Remove infected plants and avoid wet leaves.",
      },
      {
        id: "potato_healthy",
        name: "Healthy",
        images: [require("../../assets/images/corn2.jpg")],
        description: "The potato leaf looks healthy.",
        symptoms: "Green leaves without strong spots or damaged areas.",
        treatment: "Continue normal care and check the plant regularly.",
      },
    ],
  },
];

export default plants;