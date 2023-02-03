from urllib.request import urlopen
from lxml import etree
from tqdm import tqdm
from urllib.error import HTTPError
import json

languages = [
    "Abkhaz", "Adyghe", "Afar", "Afrikaans", "Ainu", "Gheg Albanian", "Tosk Albanian", "Aleut", "Altai", "Amharic",
    "Arabic", "Aramaic", "Arbanaski", "Armenian", "Eastern Armenian", "Assamese", "Avar", "Azeri",
    "Balochi", "Basaa", "Bashkir", "Basque", "Belarusian", "Bemba", "Bengali", "Bihari", "Bole", "Brahui", "Brazilian",
    "Breton", "Bulgarian", "Burmese", "Burushaski", "Buryat", "Buyang", "Catalan", "Cebuano", "Chechen",
    "Cantonese", "Mandarin", "Chuvash", "Comorian", "Cornish", "Croatian", "Czech", "Danish",
    "Dargwa", "Dhivehi", "Digor Ossetic", "Dizi", "Douala", "Dutch", "English", "Estonian", "Even",
    "Faroese", "Finnish", "Flemish", "French", "Frisian", "Friulian", "Fula", "Galician", "Gelao", "Georgian",
    "German", "Greek", "Eastern Greenlandic", "Western Greenlandic", "Gujarati", "Romani", "Hausa",
    "Hebrew", "Hindi", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Iron Ossetic", "Ishkashimi",
    "Istro-Romanian", "Italian", "Japanese", "Javanese", "Kabardian", "Kabylian", "Kalasha", "Kalmyk",
    "Kannada", "Karelian", "Kashmiri", "Kazakh", "Ket", "Khanti", "Khmer", "Khowar", "Kivalliq", "Komi", "Korean",
    "Kurdish", "Kurukh", "Kyrgyz", "Labrador Inuttut", "Ladin", "Lahnda", "Lak", "Lao", "Latvian", "Letzebuergesch",
    "Lezgian", "Lithuanian", "Macedonian", "Magahi", "Malagasy", "Malayalam", "Maltese", "Mansi", "Maori", "Marathi",
    "Mari", "Marwari", "Mon", "Mongolian", "Nayi", "Nenets", "Nepali", "Norwegian Bokmal", "Norwegian Nynorsk",
    "Oriya", "Oromo", "Oroqen", "Pashto", "Pennsylvania Dutch", "Persian", "Polish", "Portuguese", "Provencal",
    "Punjabi", "Romanian", "Romansch", "Russian", "Sami", "Samoan", "Sardinian Logudorese", "Sardinian Nuorese",
    "Sariqoli", "Schwyzerduetsch", "Scots", "Scottish Gaelic", "Serbian", "Shan", "Sheko", "Sindhi",
    "Sinhalese", "Slovak", "Slovene", "Somali", "Spanish", "Sranan", "Swahili", "Swedish", "Tagalog", "Tahitian",
    "Tajik", "Tamasheq", "Tamil", "Tashelhit", "Tatar", "Tausug", "Telugu", "Thai", "Tibetan", "Tigrigna",
    "Tmazight", "Tsakonian", "Turkish", "Turkmen", "Tuvan", "Ukrainian", "Urdu", "Uyghur", "Uzbek",
    "Veps", "Vietnamese", "Vlach", "Wakhi", "Walloon", "Warji", "Waziri", "Welsh", "Wolof", "Yakut", "Yiddish",
    "Yoruba", "Yupik", "Zazaki", "Zulu"
]

replacement_dict = {
    "Digor_Ossetic": 'Ossetic_(Digor)',
    "Iron_Ossetic": 'Ossetic_(Iron)',
    'Kabardino-Cherkess': 'Kabardino_Cherkess',
    "Norwegian_(Bokmal)": 'Norwegian(bokmal)',
    "Norwegian_(Nynorsk)": 'Norwegian(nynorsk)',
    "Sardinian_Logudorese": 'Sardinian_L',
    "Sardinian_Nuorese": 'Sardinian_N',
    "Tamasheq_(Tuareg)": 'Tamasheq'
}

#languages = [replacement_dict[l] if l in replacement_dict.keys() else l.replace(' ', '_') for l in languages]

visited_language_pairs = []



out = ''

idxs = {}

out += '{\n\t"indices": {'
for l in languages:
    k = len(idxs)
    idxs[l] = k
    out += f'\n\t\t"{l}": {k},'

js = None
with open('data.json') as d:
    js = json.loads(d.read())

out = out[:-1] + '\n\t},\n\t"map": ['

dsl = []
for i in range(len(idxs)):
    n = [-1] * len(idxs)
    dsl.append(n)


for k in tqdm(js['languageData']['languages']):
    l1, l2 = k['language1'], k['language2']

    if l1 not in idxs or l2 not in idxs:
        continue

    dsl[idxs[l1]][idxs[l2]] = k['distance']
    dsl[idxs[l2]][idxs[l1]] = k['distance']


for k in range(len(dsl)):
    out += '\n\t\t\t['
    for k2 in range(len(dsl[k])):
        out += f'{dsl[k][k2]},'
    out = out[:-1] + '],'

out = out[:-1] + '\n\t]\n}'

# distances.to_csv('distances_sparse_elinguistics.csv')

print(out)