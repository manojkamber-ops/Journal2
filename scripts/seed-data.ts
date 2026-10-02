// ─────────────────────────────────────────────────────────────────────────────
// Content pools for the Iran Journal of Computer Science seed generator.
// All data is deterministic (seeded PRNG in seed.ts) and fictional.
// ─────────────────────────────────────────────────────────────────────────────

export const JOURNAL = {
  name: 'Iran Journal of Computer Science',
  shortName: 'IJCS',
  issn: '2520-8438',
  eissn: '2520-8446',
  publisher: 'Springer Nature',
  prefix: '10.22034/ijcs',
  founded: 2018,
};

// ── Iranian names ────────────────────────────────────────────────────────────
export const IR_MALE = [
  'Ali', 'Mohammad', 'Reza', 'Hossein', 'Amir', 'Saeed', 'Mehdi', 'Hamed', 'Behnam', 'Arash',
  'Kaveh', 'Nima', 'Ehsan', 'Omid', 'Saman', 'Amin', 'Mahdi', 'Farshad', 'Babak', 'Siavash',
  'Pouya', 'Milad', 'Payman', 'Vahid', 'Mehrdad', 'Behzad', 'Shahram', 'Alireza', 'Masoud',
  'Kourosh', 'Bijan', 'Dariush', 'Farhad', 'Hashem', 'Iman', 'Javad', 'Kazem', 'Morteza',
  'Nader', 'Parviz', 'Rahim', 'Sadegh', 'Yousef', 'Navid', 'Ramin', 'Soroush', 'Tohid',
  'Ashkan', 'Bardia', 'Kian', 'Mani', 'Naser', 'Hamidreza', 'Kambiz', 'Loghman', 'Kiarash',
  'Roozbeh', 'Shayan', 'Sohrab', 'Afshin', 'Cyrus', 'Danial', 'Farzin', 'Goudarz', 'Hooman',
  'Kasra', 'Mazin', 'Peyvand', 'Rahmat', 'Sirous', 'Tirdad',
];

export const IR_FEMALE = [
  'Fatemeh', 'Zahra', 'Maryam', 'Sara', 'Negin', 'Leila', 'Shirin', 'Parisa', 'Sima', 'Roya',
  'Elham', 'Nasrin', 'Sahar', 'Sepideh', 'Arezoo', 'Bahareh', 'Nazanin', 'Pardis', 'Yasaman',
  'Sanaz', 'Mahtab', 'Niloofar', 'Hanieh', 'Behnaz', 'Razieh', 'Marzieh', 'Somayeh', 'Zohreh',
  'Mahsa', 'Atefeh', 'Saba', 'Taraneh', 'Shabnam', 'Mina', 'Farzaneh', 'Khatereh', 'Ladan',
  'Mandana', 'Nafiseh', 'Parvaneh', 'Roshanak', 'Shohreh', 'Tannaz', 'Vida', 'Yekta', 'Anahita',
  'Bita', 'Delaram', 'Elaheh', 'Farima', 'Golnaz', 'Hengameh', 'Katayoun', 'Mahkameh', 'Nastaran',
  'Pouneh', 'Sogol', 'Vajiheh', 'Zhila', 'Afsaneh',
];

export const IR_FAMILY = [
  'Ahmadi', 'Hosseini', 'Karimi', 'Moradi', 'Mousavi', 'Rezaei', 'Jafari', 'Mahdavi', 'Sadeghi',
  'Ebrahimi', 'Gholami', 'Alizadeh', 'Farhadi', 'Khosravi', 'Tehrani', 'Shirazi', 'Esfahani',
  'Tabrizi', 'Rostami', 'Naderi', 'Yazdani', 'Sharifi', 'Bagheri', 'Rahimi', 'Kamali', 'Zare',
  'Moghaddam', 'Parvizi', 'Amiri', 'Jamshidi', 'Fathi', 'Ghaffari', 'Salehi', 'Akbari',
  'Mirzaei', 'Hashemi', 'Aghaei', 'Ghaderi', 'Nazari', 'Bahrami', 'Soltani', 'Kazemi',
  'Asadi', 'Ahmadian', 'Rahmani', 'Abbasi', 'Sheikhi', 'Zandi', 'Parsa', 'Keshavarz',
  'Arabani', 'Bayat', 'Chitsaz', 'Dastjerdi', 'Enayati', 'Fereidouni', 'Habibi', 'Iranmanesh',
  'Jahromi', 'Kianfar', 'Lashgari', 'Marandi', 'Nematollahi', 'Oveisi', 'Pourmohammad',
  'Rahmati', 'Saberi', 'Tavakoli', 'Vahdati', 'Yaghmaei', 'Zarrabi', 'Alishahi', 'Bakhtiari',
  'Dadkhah', 'Ganjali', 'Hedayati', 'Imani', 'Javanmard', 'Kaviani', 'Lotfi',
  'Molaei', 'Niknam', 'Omidvar', 'Pourali', 'Rezvani', 'Sohrabi', 'Tabatabaei', 'Vosoughi',
  'Yousefzadeh', 'Zamani', 'Arefi', 'Bolandi', 'Dorri', 'Hosseinzadeh', 'Khatibi',
];

// ── Iranian universities / research institutes ──────────────────────────────
export const IR_INSTITUTIONS = [
  { uni: 'University of Tehran', city: 'Tehran', dept: 'School of Electrical and Computer Engineering', domain: 'ut.ac.ir' },
  { uni: 'Sharif University of Technology', city: 'Tehran', dept: 'Department of Computer Engineering', domain: 'sharif.edu' },
  { uni: 'Amirkabir University of Technology', city: 'Tehran', dept: 'Department of Computer Engineering', domain: 'aut.ac.ir' },
  { uni: 'Iran University of Science and Technology', city: 'Tehran', dept: 'School of Computer Engineering', domain: 'iust.ac.ir' },
  { uni: 'Tarbiat Modares University', city: 'Tehran', dept: 'Faculty of Electrical and Computer Engineering', domain: 'modares.ac.ir' },
  { uni: 'K.N. Toosi University of Technology', city: 'Tehran', dept: 'Faculty of Computer Engineering', domain: 'kntu.ac.ir' },
  { uni: 'Shahid Beheshti University', city: 'Tehran', dept: 'Department of Computer Science', domain: 'sbu.ac.ir' },
  { uni: 'Kharazmi University', city: 'Tehran', dept: 'Faculty of Computer Science and Engineering', domain: 'khu.ac.ir' },
  { uni: 'Ferdowsi University of Mashhad', city: 'Mashhad', dept: 'Department of Computer Engineering', domain: 'um.ac.ir' },
  { uni: 'Isfahan University of Technology', city: 'Isfahan', dept: 'Department of Computer Engineering', domain: 'iut.ac.ir' },
  { uni: 'University of Isfahan', city: 'Isfahan', dept: 'Faculty of Computer Engineering', domain: 'ui.ac.ir' },
  { uni: 'Shiraz University', city: 'Shiraz', dept: 'Department of Computer Science and Engineering', domain: 'shirazu.ac.ir' },
  { uni: 'Shiraz University of Technology', city: 'Shiraz', dept: 'Department of Information Technology Engineering', domain: 'sutech.ac.ir' },
  { uni: 'University of Tabriz', city: 'Tabriz', dept: 'Faculty of Electrical and Computer Engineering', domain: 'tabrizu.ac.ir' },
  { uni: 'Babol Noshirvani University of Technology', city: 'Babol', dept: 'Department of Computer Engineering', domain: 'nit.ac.ir' },
  { uni: 'Shahrood University of Technology', city: 'Shahrood', dept: 'Faculty of Electrical and Robotic Engineering', domain: 'shahroodut.ac.ir' },
  { uni: 'Semnan University', city: 'Semnan', dept: 'Department of Computer Engineering', domain: 'semnan.ac.ir' },
  { uni: 'Yazd University', city: 'Yazd', dept: 'Department of Computer Engineering', domain: 'yazd.ac.ir' },
  { uni: 'Bu-Ali Sina University', city: 'Hamedan', dept: 'Department of Computer Engineering', domain: 'basu.ac.ir' },
  { uni: 'University of Guilan', city: 'Rasht', dept: 'Faculty of Engineering', domain: 'guilan.ac.ir' },
  { uni: 'Institute for Research in Fundamental Sciences (IPM)', city: 'Tehran', dept: 'School of Computer Science', domain: 'ipm.ir' },
  { uni: 'Research Institute for ICT (ICTRC)', city: 'Tehran', dept: 'Intelligent Systems Group', domain: 'ictrc.ir' },
  { uni: 'University of Kashan', city: 'Kashan', dept: 'Department of Computer Engineering', domain: 'kashanu.ac.ir' },
  { uni: 'Razi University', city: 'Kermanshah', dept: 'Faculty of Engineering', domain: 'razi.ac.ir' },
];

// ── International institutions ───────────────────────────────────────────────
export const INTERNATIONAL = [
  { given: 'Emre', family: 'Yılmaz', uni: 'Middle East Technical University', country: 'Türkiye', dept: 'Department of Computer Engineering', domain: 'metu.edu.tr' },
  { given: 'Ayşe', family: 'Demir', uni: 'Boğaziçi University', country: 'Türkiye', dept: 'Department of Computer Engineering', domain: 'boun.edu.tr' },
  { given: 'Rahul', family: 'Sharma', uni: 'Indian Institute of Technology Delhi', country: 'India', dept: 'Department of Computer Science and Engineering', domain: 'iitd.ac.in' },
  { given: 'Priya', family: 'Nair', uni: 'Indian Institute of Science', country: 'India', dept: 'Department of Computational and Data Sciences', domain: 'iisc.ac.in' },
  { given: 'Vikram', family: 'Patel', uni: 'National Institute of Technology Trichy', country: 'India', dept: 'Department of Computer Applications', domain: 'nitt.edu' },
  { given: 'Lukas', family: 'Weber', uni: 'Technical University of Munich', country: 'Germany', dept: 'Department of Informatics', domain: 'tum.de' },
  { given: 'Anna', family: 'Schmidt', uni: 'RWTH Aachen University', country: 'Germany', dept: 'Chair for Computer Science', domain: 'rwth-aachen.de' },
  { given: 'Liam', family: 'Carter', uni: 'University of Waterloo', country: 'Canada', dept: 'David R. Cheriton School of Computer Science', domain: 'uwaterloo.ca' },
  { given: 'Emily', family: 'Thompson', uni: 'McGill University', country: 'Canada', dept: 'School of Computer Science', domain: 'mcgill.ca' },
  { given: 'Jack', family: 'Wilson', uni: 'Monash University', country: 'Australia', dept: 'Faculty of Information Technology', domain: 'monash.edu' },
  { given: 'Olivia', family: 'Brown', uni: 'University of Melbourne', country: 'Australia', dept: 'School of Computing and Information Systems', domain: 'unimelb.edu.au' },
  { given: 'Ahmad', family: 'Zulkifli', uni: 'Universiti Teknologi Malaysia', country: 'Malaysia', dept: 'School of Computing', domain: 'utm.my' },
  { given: 'Nurul', family: 'Aisyah', uni: 'Universiti Putra Malaysia', country: 'Malaysia', dept: 'Faculty of Computer Science and IT', domain: 'upm.edu.my' },
  { given: 'Omar', family: 'Al-Hashimi', uni: 'Khalifa University', country: 'United Arab Emirates', dept: 'Department of Electrical and Computer Engineering', domain: 'ku.ac.ae' },
  { given: 'Layla', family: 'Al-Mansoori', uni: 'United Arab Emirates University', country: 'United Arab Emirates', dept: 'College of Information Technology', domain: 'uaeu.ac.ae' },
  { given: 'James', family: 'Clarke', uni: 'University of Manchester', country: 'United Kingdom', dept: 'Department of Computer Science', domain: 'manchester.ac.uk' },
  { given: 'Sophie', family: 'Harris', uni: 'University of Edinburgh', country: 'United Kingdom', dept: 'School of Informatics', domain: 'ed.ac.uk' },
  { given: 'Michael', family: 'Johnson', uni: 'Georgia Institute of Technology', country: 'United States', dept: 'College of Computing', domain: 'gatech.edu' },
  { given: 'Sarah', family: 'Mitchell', uni: 'University of Michigan', country: 'United States', dept: 'Department of Electrical Engineering and Computer Science', domain: 'umich.edu' },
  { given: 'Wei', family: 'Zhang', uni: 'Tsinghua University', country: 'China', dept: 'Department of Computer Science and Technology', domain: 'tsinghua.edu.cn' },
  { given: 'Li', family: 'Chen', uni: 'Zhejiang University', country: 'China', dept: 'College of Computer Science', domain: 'zju.edu.cn' },
  { given: 'Usman', family: 'Khan', uni: 'National University of Sciences and Technology', country: 'Pakistan', dept: 'School of Electrical Engineering and Computer Science', domain: 'nust.edu.pk' },
  { given: 'Ayesha', family: 'Siddiqui', uni: 'Lahore University of Management Sciences', country: 'Pakistan', dept: 'Department of Computer Science', domain: 'lums.edu.pk' },
  { given: 'Ahmed', family: 'Hassan', uni: 'Cairo University', country: 'Egypt', dept: 'Faculty of Computers and Artificial Intelligence', domain: 'cu.edu.eg' },
  { given: 'Mona', family: 'Farouk', uni: 'Ain Shams University', country: 'Egypt', dept: 'Faculty of Engineering', domain: 'asu.edu.eg' },
  { given: 'Thomas', family: 'Dubois', uni: 'Sorbonne Université', country: 'France', dept: "Laboratoire d'Informatique de Paris 6", domain: 'sorbonne-universite.fr' },
  { given: 'Camille', family: 'Laurent', uni: 'Université Paris-Saclay', country: 'France', dept: 'LISN, CNRS', domain: 'universite-paris-saclay.fr' },
  { given: 'Budi', family: 'Santoso', uni: 'Institut Teknologi Bandung', country: 'Indonesia', dept: 'School of Electrical Engineering and Informatics', domain: 'itb.ac.id' },
  { given: 'Dewi', family: 'Lestari', uni: 'Universitas Gadjah Mada', country: 'Indonesia', dept: 'Department of Computer Science and Electronics', domain: 'ugm.ac.id' },
  { given: 'Khaled', family: 'Al-Omari', uni: 'University of Jordan', country: 'Jordan', dept: 'King Abdullah II School of Information Technology', domain: 'ju.edu.jo' },
  { given: 'Chukwuemeka', family: 'Okafor', uni: 'University of Lagos', country: 'Nigeria', dept: 'Department of Computer Sciences', domain: 'unilag.edu.ng' },
];

// ── Subject areas ────────────────────────────────────────────────────────────
export const SECTIONS = [
  'Artificial Intelligence & Machine Learning',
  'Computer Vision & Pattern Recognition',
  'Data Science & Big Data Analytics',
  'Computer Networks & Security',
  'Software Engineering & Systems',
  'Natural Language Processing',
  'Internet of Things & Embedded Systems',
  'Cloud & Distributed Computing',
  'Human–Computer Interaction',
  'Theoretical Computer Science',
  'Health & Bioinformatics',
];

// ── Keywords per section ─────────────────────────────────────────────────────
export const KEYWORDS: Record<string, string[]> = {
  'Artificial Intelligence & Machine Learning': ['deep learning', 'convolutional neural network', 'transfer learning', 'explainable AI', 'reinforcement learning', 'classification', 'feature selection', 'ensemble learning', 'graph neural networks', 'few-shot learning', 'attention mechanism', 'model interpretability'],
  'Computer Vision & Pattern Recognition': ['image segmentation', 'object detection', 'feature extraction', 'convolutional neural network', 'image classification', 'face recognition', 'medical image analysis', 'data augmentation', 'semantic segmentation', 'visual attention', 'image restoration', 'YOLO'],
  'Data Science & Big Data Analytics': ['data mining', 'time series forecasting', 'predictive analytics', 'clustering', 'dimensionality reduction', 'stream processing', 'big data', 'anomaly detection', 'Apache Spark', 'recommender systems', 'knowledge graphs', 'data quality'],
  'Computer Networks & Security': ['intrusion detection', 'network security', 'cryptography', 'malware detection', 'adversarial attacks', 'IoT security', 'authentication', 'privacy-preserving', 'software-defined networking', 'blockchain', 'penetration testing', 'zero-trust architecture'],
  'Software Engineering & Systems': ['software testing', 'code smells', 'technical debt', 'agile development', 'requirements engineering', 'program analysis', 'software maintenance', 'DevOps', 'microservices', 'fault localization', 'model-driven engineering', 'code review'],
  'Natural Language Processing': ['Persian text mining', 'sentiment analysis', 'named entity recognition', 'large language models', 'text classification', 'machine translation', 'question answering', 'word embeddings', 'transformers', 'information extraction', 'topic modeling', 'low-resource languages'],
  'Internet of Things & Embedded Systems': ['Internet of Things', 'edge computing', 'wireless sensor networks', 'MQTT', 'smart agriculture', 'energy efficiency', 'real-time systems', 'digital twins', 'smart home', 'LPWAN', 'fog computing', 'embedded machine learning'],
  'Cloud & Distributed Computing': ['cloud computing', 'resource scheduling', 'container orchestration', 'serverless computing', 'load balancing', 'virtual machines', 'Kubernetes', 'cost optimization', 'task scheduling', 'distributed databases', 'elasticity', 'multi-cloud'],
  'Human–Computer Interaction': ['usability evaluation', 'user experience', 'eye tracking', 'accessibility', 'virtual reality', 'augmented reality', 'persuasive technology', 'interaction design', 'gamification', 'user study', 'cognitive load', 'adaptive interfaces'],
  'Theoretical Computer Science': ['approximation algorithms', 'complexity theory', 'graph theory', 'combinatorial optimization', 'automata theory', 'formal verification', 'caching algorithms', 'randomized algorithms', 'computational geometry', 'parameterized complexity'],
  'Health & Bioinformatics': ['electrocardiogram', 'medical imaging', 'gene expression', 'clinical decision support', 'electronic health records', 'biomedical signal processing', 'protein structure prediction', 'wearable devices', 'telemedicine', 'MRI segmentation', 'epidemic modeling', 'multi-omics'],
};

// ── Application tasks per section ────────────────────────────────────────────
export const TASKS: Record<string, string[]> = {
  'Artificial Intelligence & Machine Learning': [
    'anomaly detection in industrial processes', 'energy consumption forecasting', 'crop yield prediction', 'stock market trend prediction', 'student academic performance prediction', 'credit risk assessment', 'air quality estimation', 'electricity load forecasting', 'demand forecasting in retail supply chains', 'software defect prediction', 'traffic congestion prediction', 'groundwater level estimation', 'fraud detection in financial transactions', 'machine remaining useful life estimation', 'customer churn prediction', 'spam detection', 'drought early warning', 'solar irradiance forecasting', 'wind speed prediction', 'network traffic classification',
  ],
  'Computer Vision & Pattern Recognition': [
    'Persian handwritten digit recognition', 'brain tumor segmentation', 'breast cancer detection from mammograms', 'plant leaf disease identification', 'facial expression recognition', 'crowd density estimation', 'fruit quality grading', 'crack detection in civil infrastructure', 'sign language recognition', 'license plate recognition', 'liver lesion classification', 'palmprint verification', 'smoke and fire detection', 'glaucoma screening from fundus images', 'retinal vessel segmentation', 'vehicle counting in aerial imagery', 'wood defect classification', 'diabetic retinopathy grading', 'skin lesion analysis', 'defect inspection in PCB manufacturing',
  ],
  'Data Science & Big Data Analytics': [
    'urban mobility pattern mining', 'hotel demand analysis', 'social media opinion mining', 'smart meter data analytics', 'ride-hailing demand forecasting', 'epidemic spread modeling', 'climate data analysis', 'recommendation of Persian music playlists', 'e-commerce basket analysis', 'banking customer segmentation', 'energy theft identification', 'clickstream analysis', 'traffic accident hotspot analysis', 'water quality monitoring analytics', 'scholarly citation network analysis',
  ],
  'Computer Networks & Security': [
    'distributed denial-of-service attack mitigation', 'botnet detection in encrypted traffic', 'phishing website detection', 'SQL injection prevention', 'ransomware behaviour analysis', 'man-in-the-middle detection in vehicular networks', 'secure routing in wireless sensor networks', 'identity authentication in IoT networks', 'zero-day exploit detection', 'network intrusion detection', 'anonymity networks traffic analysis', 'smart grid cyber-physical security', 'drone swarming attack prevention', 'web spam detection', 'insider threat detection',
  ],
  'Software Engineering & Systems': [
    'automated test case generation', 'code smell refactoring', 'API misuse detection', 'continuous integration build failure prediction', 'mobile application energy profiling', 'software effort estimation', 'requirements traceability recovery', 'automated program repair', 'microservice decomposition', 'runtime performance bottleneck detection', 'just-in-time defect prediction', 'crowdsourced software testing', 'legacy system modernization', 'UML model completion', 'automated GUI testing of Android apps',
  ],
  'Natural Language Processing': [
    'Persian sentiment analysis', 'Persian named entity recognition', 'Persian question answering', 'formal–informal Persian text conversion', 'Persian abstractive text summarization', 'Persian speech-to-text alignment', 'Persian offensive language detection', 'legal document classification', 'Persian plagiarism detection', 'Persian keyword extraction', 'Persian machine translation quality estimation', 'dialect identification for Persian varieties', 'Persian misinformation detection', 'Persian dependency parsing', 'medical Persian text normalization',
  ],
  'Internet of Things & Embedded Systems': [
    'smart irrigation control', 'indoor air quality monitoring', 'structural health monitoring of bridges', 'livestock health monitoring', 'precision agriculture monitoring', 'elderly fall detection', 'smart parking management', 'cold-chain logistics monitoring', 'smart grid metering infrastructure', 'wearable rehabilitation tracking', 'industrial equipment condition monitoring', 'wildfire early detection', 'smart classroom occupancy sensing', 'water distribution network monitoring', 'bee hive acoustic monitoring',
  ],
  'Cloud & Distributed Computing': [
    'virtual machine consolidation in data centers', 'workflow scheduling in hybrid clouds', 'container image distribution', 'serverless function placement', 'edge–cloud offloading', 'video streaming cache optimization', 'big data cluster autoscaling', 'disaster recovery orchestration', 'multi-tenant database isolation', 'energy-aware cloud resource allocation', 'federated learning orchestration across clouds', 'microservice autoscaling policies', 'cloud cost anomaly detection', 'IoT stream processing placement', 'GPU sharing for deep learning workloads',
  ],
  'Human–Computer Interaction': [
    'museum visitor engagement', 'e-learning platform usability', 'mental workload assessment', 'driver distraction monitoring', "older adults' smartphone adoption", "children's coding education interfaces", 'Persian keyboard text entry', 'in-vehicle infotainment interaction', 'VR-based safety training', 'augmented reality assembly guidance', 'social robot tutoring', 'accessible web navigation for visually impaired users', 'emotional design in health apps', 'smartwatch gesture input', 'multimodal interaction for smart homes',
  ],
  'Theoretical Computer Science': [
    'the nurse rostering problem', 'the quadratic assignment problem', 'the capacitated vehicle routing problem', 'the maximum edge-disjoint paths problem', 'the differential privacy budget allocation problem', 'the graph coloring problem on planar graphs', 'the string matching problem', 'the knapsack problem with conflicts', 'the minimum latency problem', 'the set cover problem under uncertainty', 'the multi-objective shortest path problem', 'the scheduling problem on unrelated parallel machines', 'the dominating set problem in social networks', 'the facility location problem', 'the timetable synchronization problem',
  ],
  'Health & Bioinformatics': [
    'electrocardiogram arrhythmia classification', 'electroencephalogram emotion recognition', 'gene expression-based cancer subtyping', 'drug–target interaction prediction', 'diabetes complication risk stratification', 'brain–computer interface spelling', 'respiratory sound classification', 'genomic variant calling pipelines', 'hospital readmission prediction', 'COVID-19 severity prediction', 'protein secondary structure prediction', 'sleep stage scoring', 'microRNA–disease association prediction', 'electromyographic gesture decoding', 'clinical trial outcome forecasting',
  ],
};

// ── Methods / techniques per section ─────────────────────────────────────────
export const METHODS: Record<string, string[]> = {
  'Artificial Intelligence & Machine Learning': ['Deep Learning', 'Graph Neural Networks', 'Federated Learning', 'Ensemble Learning', 'Transfer Learning', 'Reinforcement Learning', 'Autoencoder', 'Convolutional Neural Network', 'LSTM Networks', 'Attention Mechanism', 'Gradient Boosting', 'Bayesian Optimization', 'Self-Supervised Learning', 'Contrastive Learning', 'Meta-Learning', 'Explainable Artificial Intelligence'],
  'Computer Vision & Pattern Recognition': ['U-Net', 'Vision Transformers', 'Faster R-CNN', 'YOLOv8', 'DeepLabv3+', 'ResNet', 'EfficientNet', 'Generative Adversarial Networks', 'Segment Anything Model', 'Siamese Networks', 'Mask R-CNN', 'Swin Transformer'],
  'Data Science & Big Data Analytics': ['Apache Spark', 'Long Short-Term Memory Networks', 'Prophet', 'DBSCAN', 'XGBoost', 'Knowledge Graph Embeddings', 'Isolation Forest', 'Hierarchical Clustering', 'Principal Component Analysis', 'Collaborative Filtering', 'Transformer Encoders', 'Graph Mining'],
  'Computer Networks & Security': ['Deep Packet Inspection', 'Long Short-Term Memory Autoencoders', 'Elliptic Curve Cryptography', 'Blockchain', 'Homomorphic Encryption', 'Software-Defined Networking', 'Behavioral Biometrics', 'Adversarial Training', 'Federated Intrusion Detection', 'Random Forest Classifiers', 'Graph-Based Anomaly Detection', 'Reinforcement Learning Agents'],
  'Software Engineering & Systems': ['Genetic Algorithms', 'Static Code Analysis', 'Natural Language Processing', 'Machine Learning Classifiers', 'Model Checking', 'Mutation Testing', 'Program Slicing', 'Deep Learning Embeddings', 'Search-Based Software Testing', 'Formal Specifications', 'Graph Convolutional Networks', 'Large Language Models'],
  'Natural Language Processing': ['BERT', 'ParsBERT', 'Transformer Networks', 'GPT-2', 'Word2Vec', 'FastText', 'Bidirectional LSTMs', 'Attention Mechanisms', 'Large Language Models', 'Conditional Random Fields', 'Multilingual Encoders', 'Prompt Engineering'],
  'Internet of Things & Embedded Systems': ['TinyML', 'LoRaWAN', 'MQTT Protocol', 'Edge Computing', 'Digital Twin Modeling', 'Fog Computing', 'Kalman Filtering', 'BLE Mesh Networks', 'Convolutional Neural Networks on FPGA', 'Lightweight Cryptography', 'Event-Driven Architectures', 'NB-IoT'],
  'Cloud & Distributed Computing': ['Container Orchestration', 'Reinforcement Learning Schedulers', 'Kubernetes', 'Serverless Frameworks', 'Ant Colony Optimization', 'Particle Swarm Optimization', 'Deep Reinforcement Learning', 'Queueing Theory Models', 'Game-Theoretic Allocation', 'Apache Kafka', 'Federated Resource Management', 'Predictive Autoscaling'],
  'Human–Computer Interaction': ['Eye Tracking', 'Electrodermal Activity Sensing', 'Virtual Reality', 'Augmented Reality', 'Gamification', 'Affective Computing', 'Think-Aloud Protocols', 'Electroencephalography', 'Speech Interfaces', 'Haptic Feedback', 'Adaptive User Interfaces', 'Persona-Based Design'],
  'Theoretical Computer Science': ['Branch and Bound', 'Approximation Algorithms', 'Integer Linear Programming', 'Simulated Annealing', 'Dynamic Programming', 'Memetic Algorithms', 'Column Generation', 'Constraint Programming', 'Parameterized Algorithms', 'Tabu Search', 'Rolling Horizon Heuristics', 'Local Search'],
  'Health & Bioinformatics': ['Convolutional Neural Networks', 'Random Forests', 'Support Vector Machines', 'Graph Neural Networks', 'Wavelet Transforms', 'Autoencoder Networks', 'XGBoost', 'Attention-Based Networks', 'Ensemble Classifiers', 'Recurrence Plots', 'Hidden Markov Models', 'Transfer Learning'],
};

// ── Datasets ─────────────────────────────────────────────────────────────────
export const DATASETS = [
  'a curated dataset of 12,400 samples collected from 14 Iranian hospitals',
  'the MIMIC-III clinical database',
  'an annotated corpus of 45,000 Persian social media posts',
  'a real-world dataset gathered from 2,300 IoT sensor nodes over 18 months',
  'the CIFAR-10 benchmark and two agricultural image datasets',
  'the Kaggle Credit Card Fraud dataset enriched with local records',
  'the ISIC 2019 skin lesion archive',
  'a five-year archive of Tehran air-quality telemetry',
  'the NSL-KDD and CICIDS2017 benchmark suites',
  'the PhysioNet PTB-XL dataset',
  'a dataset of 8,700 anonymized student records from 12 universities',
  'the Stanford Sentiment Treebank and a parallel Persian corpus',
  'the ISPRS Vaihingen aerial benchmark',
  'an open dataset of 31,000 labeled X-ray images',
  'the UCI Machine Learning Repository benchmarks',
  'a longitudinal dataset from 340 smart-home deployments',
  'the FarsDat Persian speech corpus',
  'six public software repositories written in Java and Python',
  'the MNIST and Hoda Persian digit datasets',
  'a proprietary fleet telemetry dataset of 1,100 delivery vehicles',
];

// ── Venues for fake references ───────────────────────────────────────────────
export const REF_VENUES = [
  'IEEE Transactions on Neural Networks and Learning Systems', 'Expert Systems with Applications',
  'Applied Soft Computing', 'IEEE Access', 'Knowledge-Based Systems', 'Pattern Recognition',
  'Computers & Security', 'Journal of Network and Computer Applications', 'Neural Computing and Applications',
  'IEEE Internet of Things Journal', 'Future Generation Computer Systems', 'Information Sciences',
  'ACM Computing Surveys', 'Engineering Applications of Artificial Intelligence', 'IEEE Transactions on Industrial Informatics',
  'Sensors', 'IEEE Transactions on Information Forensics and Security', 'Journal of Big Data',
  'Artificial Intelligence Review', 'Soft Computing', 'Measurement', 'IEEE Transactions on Cybernetics',
  'Computer Methods and Programs in Biomedicine', 'Information Processing & Management', 'International Journal of Information Security',
  'IEEE Transactions on Software Engineering', 'Empirical Software Engineering', 'Journal of Systems and Software',
  'IEEE/ACM Transactions on Audio, Speech, and Language Processing', 'Computer Speech & Language',
  'Ad Hoc Networks', 'Computer Networks', 'IEEE Transactions on Cloud Computing', 'IEEE Transactions on Services Computing',
  'International Journal of Human-Computer Studies', 'Computers in Human Behavior', 'Theoretical Computer Science',
  'Algorithmica', 'Journal of Combinatorial Optimization', 'Briefings in Bioinformatics',
  'IEEE Journal of Biomedical and Health Informatics', 'BMC Bioinformatics', 'PLOS ONE',
  'Proc. IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)',
  'Proc. International Conference on Learning Representations (ICLR)',
  'Proc. ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD)',
  'Proc. ACM ESEC/FSE',
  'Proc. Annual Meeting of the Association for Computational Linguistics (ACL)',
  'Proc. IEEE Symposium on Security and Privacy (S&P)',
];

export const REF_FIRST = ['J.', 'A.', 'M.', 'S.', 'R.', 'K.', 'L.', 'T.', 'H.', 'P.', 'F.', 'C.', 'D.', 'N.', 'E.', 'W.', 'B.', 'G.'];
export const REF_LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Lee', 'Wang', 'Zhang', 'Liu', 'Chen', 'Kim', 'Park', 'Singh', 'Kumar', 'Gupta', 'Sharma', 'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Rossi', 'Ferrari', 'Silva', 'Santos', 'Yilmaz', 'Kaya', 'Demir', 'Hassan', 'Ibrahim', 'Okafor', 'Kowalski', 'Novak', 'Ivanov', 'Petrov'];

// ── Announcements ────────────────────────────────────────────────────────────
export const ANNOUNCEMENTS = [
  { date: '2026-09-30', type: 'special-issue', title: 'Volume 9, Issue 3 is now online', body: 'The September 2026 issue (Vol. 9, No. 3) featuring 8 peer-reviewed articles is now available. All articles are open access under CC BY 4.0.' },
  { date: '2026-08-12', type: 'call-for-papers', title: 'Call for Papers — Special Issue on Trustworthy and Responsible AI', body: 'Submission deadline: 15 January 2027. Topics include fairness auditing, robustness certification, model governance, and societal impact assessment. Guest editors: Prof. E. Weber and Prof. M. Khosravi.' },
  { date: '2026-06-15', type: 'indexing', title: 'CiteScore 2025 released: 4.6', body: "The journal's CiteScore has risen from 3.9 to 4.6, placing IJCS in the 74th percentile (Q2) of Computer Science Applications (Scopus)." },
  { date: '2026-04-02', type: 'news', title: 'Median time to first decision now 38 days', body: 'Thanks to an expanded Associate Editor team, the median time to first decision decreased from 42 to 38 days in Q1 2026.' },
  { date: '2026-02-20', type: 'special-issue', title: 'Volume 9, Issue 1 — Special Issue on Large Language Models', body: 'A curated collection of 9 articles covering efficient fine-tuning, Persian LLM evaluation, retrieval-augmented generation, and LLM security.' },
  { date: '2025-11-05', type: 'call-for-papers', title: 'Call for Papers — Special Issue on Green Computing and Sustainable Systems', body: 'Submission deadline: 1 April 2026. We welcome contributions on energy-aware scheduling, sustainable data centers, and low-carbon system design.' },
  { date: '2025-09-18', type: 'news', title: 'IJCS articles downloaded 148,000 times in 2025', body: 'Annual usage statistics confirm continued growth: 148,317 full-text downloads in 2025, a 21% increase over the previous year.' },
  { date: '2025-06-30', type: 'indexing', title: 'CiteScore 2024 released: 3.9', body: 'CiteScore 2024 = 3.9 (Scopus). SJR 2024 = 0.52 (Q2, Computer Science Applications). The journal is also indexed in Web of Science ESCI, DOAJ, and Google Scholar.' },
  { date: '2024-12-01', type: 'news', title: 'New manuscript submission system launched', body: 'IJCS has migrated to a streamlined submission and peer-review platform. Authors can now track their manuscripts in real time.' },
  { date: '2024-05-14', type: 'indexing', title: 'IJCS accepted for Web of Science ESCI', body: 'The journal has been accepted for coverage in the Emerging Sources Citation Index (ESCI), further expanding global discoverability.' },
  { date: '2023-03-10', type: 'news', title: 'APC waived for authors from low-income countries', body: 'Starting March 2023, the article processing charge is fully waived for corresponding authors based in World Bank-classified low-income countries.' },
  { date: '2021-08-22', type: 'indexing', title: 'CiteScore 2020 released: 1.2 — first official metric', body: 'The journal receives its first official CiteScore (1.2) following full Scopus coverage from Volume 1 onward.' },
];

// ── Editorial board ──────────────────────────────────────────────────────────
export const BOARD = [
  { role: 'Editor-in-Chief', name: 'Professor Dariush Farhoudi', affiliation: 'Department of Computer Engineering, Sharif University of Technology, Tehran, Iran', country: 'Iran', field: 'Machine Learning, Computer Networks', email: 'd.farhoudi@ijcs.ir' },
  { role: 'Deputy Editor', name: 'Professor Shirin Mozaffari', affiliation: 'Faculty of Computer Science and Engineering, Kharazmi University, Tehran, Iran', country: 'Iran', field: 'Computer Vision, Biometrics', email: 's.mozaffari@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Parviz Keshavarz', affiliation: 'Department of Computer Engineering, University of Tehran, Tehran, Iran', country: 'Iran', field: 'Software Engineering, Program Analysis', email: 'p.keshavarz@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Elham Nabizadeh', affiliation: 'Department of Computer Science, Shahid Beheshti University, Tehran, Iran', country: 'Iran', field: 'Natural Language Processing, Information Retrieval', email: 'e.nabizadeh@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Reza Alinejad-Rokny', affiliation: 'School of Computer Science, Institute for Research in Fundamental Sciences (IPM), Tehran, Iran', country: 'Iran', field: 'Bioinformatics, Data Mining', email: 'r.alinejad@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Emre Yılmaz', affiliation: 'Department of Computer Engineering, Middle East Technical University, Ankara, Türkiye', country: 'Türkiye', field: 'Network Security, Cryptography', email: 'e.yilmaz@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Anna Schmidt', affiliation: 'Chair for Computer Science, RWTH Aachen University, Aachen, Germany', country: 'Germany', field: 'Distributed Systems, Cloud Computing', email: 'a.schmidt@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Priya Nair', affiliation: 'Department of Computational and Data Sciences, Indian Institute of Science, Bengaluru, India', country: 'India', field: 'Big Data Analytics, Stream Processing', email: 'p.nair@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Michael Johnson', affiliation: 'College of Computing, Georgia Institute of Technology, Atlanta, USA', country: 'United States', field: 'HCI, Ubiquitous Computing', email: 'm.johnson@ijcs.ir' },
  { role: 'Associate Editor', name: 'Professor Layla Al-Mansoori', affiliation: 'College of Information Technology, United Arab Emirates University, Al Ain, UAE', country: 'United Arab Emirates', field: 'IoT, Edge Intelligence', email: 'l.almansoori@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Bahram Sadeghi-Nasab', affiliation: 'Department of Computer Engineering, Ferdowsi University of Mashhad, Mashhad, Iran', country: 'Iran', field: 'Theoretical Computer Science, Algorithms', email: 'b.nasab@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Nasrin Ghadiri', affiliation: 'Department of Computer Engineering, Isfahan University of Technology, Isfahan, Iran', country: 'Iran', field: 'Data Science, Semantic Web', email: 'n.ghadiri@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Alireza Baghestani', affiliation: 'Faculty of Electrical and Computer Engineering, Tarbiat Modares University, Tehran, Iran', country: 'Iran', field: 'Machine Learning, Optimization', email: 'a.baghestani@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Maryam Rastgarpour', affiliation: 'Faculty of Computer Engineering, K.N. Toosi University of Technology, Tehran, Iran', country: 'Iran', field: 'Image Processing, Neural Networks', email: 'm.rastgarpour@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Hooman Rokhsati', affiliation: 'Department of Information Technology Engineering, Shiraz University of Technology, Shiraz, Iran', country: 'Iran', field: 'Blockchain, Distributed Ledger', email: 'h.rokhsati@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Sima Valizadeh', affiliation: 'Faculty of Computer Engineering, University of Isfahan, Isfahan, Iran', country: 'Iran', field: 'Computer Architecture, Embedded Systems', email: 's.valizadeh@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Arash Bahramian', affiliation: 'Department of Computer Engineering, Babol Noshirvani University of Technology, Babol, Iran', country: 'Iran', field: 'Speech Processing, Audio AI', email: 'a.bahramian@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Mahdieh Sadeghi', affiliation: 'Department of Computer Science, University of Guilan, Rasht, Iran', country: 'Iran', field: 'Graph Theory, Combinatorics', email: 'm.sadeghi@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Kourosh Daneshjoo', affiliation: 'Department of Computer Engineering, Yazd University, Yazd, Iran', country: 'Iran', field: 'Cloud Computing, Scheduling', email: 'k.daneshjoo@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Roya Karimzadeh', affiliation: 'Faculty of New Sciences and Technologies, University of Tehran, Tehran, Iran', country: 'Iran', field: 'Geospatial AI, Remote Sensing', email: 'r.karimzadeh@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Behrouz Minaei-Bidgoli', affiliation: 'School of Computer Engineering, Iran University of Science and Technology, Tehran, Iran', country: 'Iran', field: 'Pattern Recognition, Educational Data Mining', email: 'b.minaei@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Wei Zhang', affiliation: 'Department of Computer Science and Technology, Tsinghua University, Beijing, China', country: 'China', field: 'Computer Vision, Deep Learning', email: 'w.zhang@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Sarah Mitchell', affiliation: 'Department of EECS, University of Michigan, Ann Arbor, USA', country: 'United States', field: 'Health Informatics, Wearable Computing', email: 's.mitchell@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Jack Wilson', affiliation: 'Faculty of Information Technology, Monash University, Melbourne, Australia', country: 'Australia', field: 'Software Engineering, Empirical Studies', email: 'j.wilson@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Sophie Harris', affiliation: 'School of Informatics, University of Edinburgh, Edinburgh, UK', country: 'United Kingdom', field: 'NLP, Low-Resource Languages', email: 's.harris@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Khaled Al-Omari', affiliation: 'King Abdullah II School of Information Technology, University of Jordan, Amman, Jordan', country: 'Jordan', field: 'Information Security, Digital Forensics', email: 'k.alomari@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Lukas Weber', affiliation: 'Department of Informatics, Technical University of Munich, Munich, Germany', country: 'Germany', field: 'Machine Learning, AutoML', email: 'l.weber@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Dewi Lestari', affiliation: 'Department of Computer Science and Electronics, Universitas Gadjah Mada, Yogyakarta, Indonesia', country: 'Indonesia', field: 'Data Mining, Social Network Analysis', email: 'd.lestari@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Usman Khan', affiliation: 'SEECS, National University of Sciences and Technology, Islamabad, Pakistan', country: 'Pakistan', field: 'Signal Processing, Biomedical AI', email: 'u.khan@ijcs.ir' },
  { role: 'Editorial Board', name: 'Professor Thomas Dubois', affiliation: 'LIP6, Sorbonne Université, Paris, France', country: 'France', field: 'Formal Methods, Verification', email: 't.dubois@ijcs.ir' },
];

// ── Special issues (volume-issue → theme) ────────────────────────────────────
export const SPECIAL_ISSUES: Record<string, { theme: string; description: string }> = {
  '9-1': {
    theme: 'Special Issue: Large Language Models — Theory and Applications',
    description: 'A curated collection on efficient fine-tuning, evaluation of Persian language models, retrieval-augmented generation, and the security of LLM-based systems.',
  },
  '8-2': {
    theme: 'Special Issue: AI for Healthcare and Precision Medicine',
    description: 'Advances in clinical decision support, medical image analysis, and privacy-preserving health analytics, with a focus on resource-constrained healthcare settings.',
  },
  '6-4': {
    theme: 'Special Issue: Blockchain and Trustworthy Distributed Systems',
    description: 'Consensus scalability, smart-contract verification, and decentralized identity management for next-generation distributed applications.',
  },
  '4-1': {
    theme: 'Special Issue: Data Science for Smart Cities',
    description: 'Urban sensing, mobility analytics, and energy-efficient services for rapidly growing metropolitan areas in the Global South.',
  },
};
