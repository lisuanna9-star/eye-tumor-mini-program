const mockKnowledge = [
  {
    keywords: ['视网膜母细胞瘤', 'retinoblastoma', '白瞳症', '斜视'],
    answer:
      '视网膜母细胞瘤多见于婴幼儿和儿童，常见提示包括白瞳症、斜视、视力异常和眼红眼痛。出现这些情况时，尤其是儿童反复出现白色瞳孔反光，应尽快到有眼科或眼肿瘤经验的医院就诊。',
    sources: [
      {
        title: 'Retinoblastoma Treatment (PDQ)',
        site: 'National Cancer Institute',
        url: 'https://www.cancer.gov/types/retinoblastoma'
      },
      {
        title: 'Retinoblastoma',
        site: 'MedlinePlus',
        url: 'https://medlineplus.gov/retinoblastoma.html'
      }
    ]
  },
  {
    keywords: ['葡萄膜黑色素瘤', 'uveal melanoma', '脉络膜黑色素瘤'],
    answer:
      '葡萄膜黑色素瘤是成人常见的原发性眼内恶性肿瘤之一，可能出现视物变形、闪光感、视野缺损，也可能早期没有明显症状。治疗方案通常要结合肿瘤位置、大小和有无转移综合判断。',
    sources: [
      {
        title: 'Uveal Melanoma',
        site: 'National Cancer Institute',
        url: 'https://www.cancer.gov/types/uveal-melanoma'
      },
      {
        title: 'Uveal Melanoma',
        site: 'Cleveland Clinic',
        url: 'https://my.clevelandclinic.org/health/diseases/23008-uveal-melanoma'
      }
    ]
  }
];

module.exports = {
  mockKnowledge
};
