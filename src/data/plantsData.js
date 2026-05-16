const plants = [
  {
    id: "tomato",
    name: "Tomato",
    image: require("../../assets/images/tomato.png"),

    description:
      "Tomato is a warm-season crop that needs full sunlight, regular watering and good air circulation. It is one of the most commonly grown vegetables in home gardens and farms. Tomato plants can be affected by fungal, bacterial, viral diseases and pests, especially when the weather is humid or leaves stay wet for a long time.",

    info: {
      planting: "Spring",
      watering: "Regular",
      height: "60 - 200cm",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/tomato1.png"),
      require("../../assets/images/tomato2.png"),
    ],

    diseases: [
      {
        id: "tomato_bacterial_spot",
        name: "Bacterial Spot",
        images: [require("../../assets/images/bacterial-spot.png")],
        description:
          "Bacterial spot is a serious tomato disease caused by Xanthomonas bacteria. It usually appears in warm and wet conditions. The bacteria can spread with rain splash, overhead watering, infected seeds, contaminated tools and plant contact. Crowded plants and poor air circulation make the disease easier to spread.",
        symptoms:
          "Small dark brown or black spots appear on the leaves. Some spots may have yellow areas around them. As the disease becomes stronger, leaves can turn yellow, dry out and fall. Fruits may also develop rough, raised and scabby spots.",
        treatment:
          "Remove infected leaves and avoid touching healthy plants after infected ones. Do not water the leaves directly; water the soil instead. Improve air circulation by spacing and pruning the plants. Disinfect tools regularly. Copper-based bactericides can slow the spread, but they work best as prevention. Use disease-free seeds and rotate crops for better long-term control.",
      },
      {
        id: "tomato_early_blight",
        name: "Early Blight",
        images: [require("../../assets/images/early-blight.png")],
        description:
          "Early blight is a common fungal disease caused mainly by Alternaria solani. It usually starts on older tomato leaves and becomes worse in warm, humid weather. The fungus can survive in soil and old plant debris, then spread by wind, rain splash and irrigation water.",
        symptoms:
          "Brown spots appear on older leaves first. These spots often have circular target-like rings. Leaves may turn yellow, dry and fall from the plant. In severe cases, dark lesions can also appear on stems and fruits.",
        treatment:
          "Remove infected leaves and do not leave diseased plant debris around the soil. Avoid overhead watering and keep leaves as dry as possible. Improve airflow by pruning and spacing plants correctly. Fungicides with chlorothalonil, mancozeb or copper compounds may help control the disease. Crop rotation and resistant varieties help prevent future infection.",
      },
      {
        id: "tomato_late_blight",
        name: "Late Blight",
        images: [require("../../assets/images/late-blight.png")],
        description:
          "Late blight is a very destructive disease caused by Phytophthora infestans. It spreads fast in cool, wet and humid weather. It can damage tomato plants heavily in a short time if it is not controlled. The disease spreads through infected plant material, wind and water.",
        symptoms:
          "Large dark green, brown or wet-looking spots appear on leaves and stems. In humid weather, white mold-like growth can appear under the leaves. Fruits may become brown, firm and rotten.",
        treatment:
          "Remove infected plants quickly because late blight spreads very fast. Avoid wetting leaves and reduce humidity around the plant. Do not compost infected plant material. Fungicides used for late blight may include copper products, chlorothalonil or water-mold specific fungicides depending on the region. Fungicides work best before infection or at very early stages. Resistant varieties and clean planting areas are important for prevention.",
      },
      {
        id: "tomato_leaf_mold",
        name: "Leaf Mold",
        images: [require("../../assets/images/leaf-mold.png")],
        description:
          "Leaf mold is a fungal disease usually caused by Passalora fulva. It is common in greenhouses or closed, humid growing areas. The disease develops when humidity is high and air circulation is poor. It mostly affects leaves and weakens the plant by reducing photosynthesis.",
        symptoms:
          "Yellow or pale green spots appear on the upper side of leaves. On the lower side, olive-green, gray or brown mold can develop. Infected leaves may curl, dry and fall early.",
        treatment:
          "Reduce humidity and improve ventilation. Avoid overcrowding plants and do not water leaves directly. Remove infected leaves carefully. Copper-based fungicides or chlorothalonil may help reduce the disease. Clean greenhouse surfaces and remove old plant debris to prevent the fungus from surviving.",
      },
      {
        id: "tomato_septoria_leaf_spot",
        name: "Septoria Leaf Spot",
        images: [require("../../assets/images/septoria-leaf-spot.png")],
        description:
          "Septoria leaf spot is a fungal disease caused by Septoria lycopersici. It is common in wet and humid conditions. The fungus survives in infected plant debris and spreads by water splash. It usually starts on lower and older leaves.",
        symptoms:
          "Many small round spots appear on leaves. The spots usually have dark edges and light gray or tan centers. Tiny black dots may be visible inside the spots. Leaves may turn yellow and fall early.",
        treatment:
          "Remove infected leaves and clean plant debris from the soil. Avoid overhead watering and water plants at the base. Keep weeds under control and improve airflow. Copper fungicides, chlorothalonil or mancozeb can help manage the disease when used correctly. Crop rotation is important for prevention.",
      },
      {
        id: "tomato_spider_mites",
        name: "Spider Mites",
        images: [require("../../assets/images/spider-mites.png")],
        description:
          "Spider mites are tiny pests that feed on tomato leaves by sucking plant sap. They are usually more active in hot and dry weather. Heavy infestations can weaken the plant and reduce fruit quality.",
        symptoms:
          "Leaves may show tiny yellow, white or bronze dots. The leaf surface can look dusty or dry. In severe cases, fine webbing may appear under the leaves and leaves may fall.",
        treatment:
          "Wash leaves gently with water to reduce mite numbers. Keep plants well-watered because stressed plants are more vulnerable. Remove heavily damaged leaves. Insecticidal soap, horticultural oil, neem oil or miticides can be used if infestation is severe. Avoid overusing broad insecticides because they may kill beneficial insects that control mites naturally.",
      },
      {
        id: "tomato_target_spot",
        name: "Target Spot",
        images: [require("../../assets/images/target-spot.png")],
        description:
          "Target spot is a fungal disease caused by Corynespora cassiicola. It develops in warm and humid weather and can affect leaves, stems and fruits. The fungus spreads through spores carried by wind, rain and irrigation water.",
        symptoms:
          "Brown circular spots appear on leaves. Some spots may show target-like rings. Infected leaves may dry and fall. Fruits can develop dark, sunken spots.",
        treatment:
          "Remove infected leaves and avoid leaving plant debris near the plant. Improve air circulation and reduce leaf wetness. Avoid overhead irrigation. Fungicides containing chlorothalonil, azoxystrobin or copper compounds may help control the disease. Crop rotation also helps reduce fungal survival.",
      },
      {
        id: "tomato_yellow_leaf_curl_virus",
        name: "Yellow Leaf Curl Virus",
        images: [require("../../assets/images/yellow-leaf-curl-virus.png")],
        description:
          "Tomato yellow leaf curl virus is a serious viral disease spread mainly by whiteflies. It is common in warm regions where whiteflies are active. Once a plant is infected, it cannot be cured completely and fruit production may become very low.",
        symptoms:
          "Leaves curl upward and turn yellow. New leaves may become small and thick. Plants can become stunted and may produce very few fruits.",
        treatment:
          "Remove infected plants to reduce virus spread. Control whiteflies with yellow sticky traps, insecticidal soap, neem oil or approved insecticides. Remove weeds because they can host whiteflies. Use resistant tomato varieties when possible. Prevention is the most important method because viral diseases cannot be cured after infection.",
      },
      {
        id: "tomato_mosaic_virus",
        name: "Tomato Mosaic Virus",
        images: [require("../../assets/images/tomato-mosaic-virus.png")],
        description:
          "Tomato mosaic virus is a contagious viral disease that spreads through infected seeds, tools, hands and plant contact. The virus can survive on surfaces for a long time, so poor sanitation increases the risk of infection.",
        symptoms:
          "Leaves show light and dark green mosaic patterns. Leaves may curl, become distorted or grow smaller. Plants may grow slowly and fruits may become uneven or discolored.",
        treatment:
          "Remove infected plants because there is no direct cure. Disinfect tools after use and wash hands before touching healthy plants. Avoid using infected seeds or transplants. Keep the growing area clean and avoid smoking near tomato plants because tobacco products can carry related viruses.",
      },
    
    ],
  },

  {
    id: "corn",
    name: "Corn",
    image: require("../../assets/images/corn.png"),

    description:
      "Corn is a warm-season cereal crop that needs full sunlight, fertile soil and regular watering. It grows best in warm temperatures and open areas. Corn can be affected by fungal leaf diseases, especially when humidity is high and infected crop residue remains in the field.",

    info: {
      planting: "Spring",
      watering: "2-3 times/week",
      height: "1.5 - 3m",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/corn1.png"),
      require("../../assets/images/corn2.png"),
    ],

    diseases: [
      {
        id: "corn_gray_leaf_spot",
        name: "Gray Leaf Spot",
        images: [require("../../assets/images/gray-leaf-spot.png")],
        description:
          "Gray leaf spot is a fungal corn disease caused by Cercospora zeae-maydis. It becomes more serious in warm and humid weather. The fungus survives on old corn residue and spreads by spores. Fields with continuous corn planting and poor residue management have higher disease risk.",
        symptoms:
          "Long, narrow and rectangular gray or tan lesions appear on the leaves. The spots usually stay between leaf veins. When the disease is severe, many lesions join together and large parts of the leaf dry out.",
        treatment:
          "Use resistant corn hybrids when possible. Rotate crops and manage old corn residue to reduce fungal survival. Improve airflow in dense fields. Fungicides may be used when disease pressure is high, especially before major leaf damage occurs. Always follow local label instructions for fungicide use.",
      },
      {
        id: "corn_leaf_blight",
        name: "Leaf Blight",
        images: [require("../../assets/images/leaf-blight.png")],
        description:
          "Corn leaf blight is usually caused by fungal pathogens such as Exserohilum turcicum. It develops in humid conditions and moderate temperatures. The disease survives on infected corn residue and spreads through airborne spores.",
        symptoms:
          "Long brown, gray-green or tan lesions appear on leaves. Lesions can become large and cigar-shaped. When infection is severe, leaves dry early and the plant loses photosynthetic area.",
        treatment:
          "Use resistant hybrids and rotate crops to reduce disease pressure. Remove or manage infected crop residue when possible. Avoid very dense planting if airflow is poor. Fungicides may help protect healthy leaves during high-risk periods, especially before tasseling or early reproductive stages.",
      },
      {
        id: "corn_rust_leaf",
        name: "Common Rust",
        images: [require("../../assets/images/common-rust.png")],
        description:
          "Common rust is a fungal disease caused by Puccinia sorghi. It is usually favored by cool to moderate temperatures and humid conditions. Spores spread by wind and can infect corn leaves when moisture is present.",
        symptoms:
          "Small reddish-brown or orange pustules appear on both sides of leaves. The pustules may become darker as they age. Severe infection can cause yellowing and early leaf drying.",
        treatment:
          "Plant resistant hybrids when available. Monitor plants regularly during humid weather. Fungicides can be used if rust appears early and disease pressure is high. Good field hygiene and balanced plant nutrition support stronger plant growth.",
      },
    ],
  },

  {
    id: "pepper",
    name: "Pepper",
    image: require("../../assets/images/pepper.png"),

    description:
      "Pepper is a warm-season vegetable plant that grows best in full sun, warm soil and well-drained areas. It needs regular watering but does not like leaves staying wet for long periods. Pepper plants can be affected by bacterial diseases, especially in warm and humid weather.",

    info: {
      planting: "Spring",
      watering: "2-3 times/week",
      height: "40 - 90cm",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/pepper1.png"),
      require("../../assets/images/pepper2.png"),
    ],

    diseases: [
      {
        id: "pepper_bacterial_spot",
        name: "Bacterial Spot",
        images: [require("../../assets/images/bacterial-spot-pepper.png")],
        description:
          "Bacterial spot is one of the most common pepper diseases. It is caused by Xanthomonas bacteria and affects leaves, stems and fruits. The disease spreads through infected seeds, transplants, rain splash, overhead watering and contaminated tools. Warm, wet and humid weather makes it worse.",
        symptoms:
          "Small dark water-soaked spots appear on leaves. The spots may become brown or black and may have yellow areas around them. Leaves can turn yellow and fall. Fruits may develop raised, rough or scabby spots.",
        treatment:
          "Remove infected leaves and avoid working with plants when they are wet. Water the soil instead of the leaves. Improve airflow and do not overcrowd plants. Use disease-free seeds and transplants. Fixed copper sprays can help slow the spread when used regularly, especially as prevention. Crop rotation and resistant varieties are also important.",
      },
    ],
  },

  {
    id: "potato",
    name: "Potato",
    image: require("../../assets/images/potato.png"),

    description:
      "Potato is an important food crop grown for its underground tubers. It grows best in cool to mild weather, loose soil and full sun. Potato leaves can be affected by fungal and water-mold diseases. Leaf diseases can reduce plant energy and lower tuber quality and yield.",

    info: {
      planting: "Spring",
      watering: "Moderate",
      height: "30 - 100cm",
      sunlight: "Full sun",
    },

    gallery: [
      require("../../assets/images/potato1.png"),
      require("../../assets/images/potato2.png"),
    ],

    diseases: [
      {
        id: "potato_early_blight",
        name: "Early Blight",
        images: [require("../../assets/images/early-blight-potato.png")],
        description:
          "Early blight is a common potato disease caused mainly by Alternaria solani. It usually affects older leaves first and becomes worse when plants are stressed by poor nutrition, drought or warm humid weather. The fungus can survive in infected plant debris and soil.",
        symptoms:
          "Brown spots with target-like circular rings appear on older leaves. The area around the spots may turn yellow. Leaves can dry and fall early. Severe disease reduces the plant’s ability to produce healthy tubers.",
        treatment:
          "Remove infected leaves and plant debris. Avoid overhead watering and reduce long leaf wetness. Keep plants healthy with balanced fertilization and proper watering. Crop rotation helps reduce fungal survival. Fungicides such as chlorothalonil, mancozeb or other labeled potato fungicides may be used when disease pressure is high.",
      },
      {
        id: "potato_late_blight",
        name: "Late Blight",
        images: [require("../../assets/images/late-blight-potato.png")],
        description:
          "Late blight is a serious potato disease caused by Phytophthora infestans. It is the same pathogen that can affect tomatoes. It spreads very quickly in cool, wet and humid weather. The pathogen can survive in infected potato tubers and plant material.",
        symptoms:
          "Dark, wet-looking lesions appear on leaves and stems. White mold-like growth may appear around lesions in humid conditions. Tubers can develop brown rot under the skin and may decay during storage.",
        treatment:
          "Remove infected plants and infected tubers quickly. Do not leave diseased plant material in the field. Avoid overhead irrigation and improve airflow. Use certified disease-free seed potatoes. Fungicides for late blight must be used preventively or very early, and products should be chosen according to local recommendations. Copper products, mancozeb, cymoxanil mixtures or other labeled late blight fungicides may be used depending on the region.",
      },
    ],
  },
];

export default plants;

