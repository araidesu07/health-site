---
schemaVersion: 4
layout: ../../layouts/ArticleLayout.astro
# COMPLIANCE-REVIEW: title / description の「発毛」に、承認文言の対象限定「壮年性脱毛症における」「成人男性（20歳以上）」が無い。本文なしで検索結果・AI応答に単独で出るため、脱毛症全般や女性にも使える発毛剤と読まれうる（医薬品等適正広告基準「承認を要する医薬品の効能効果等の表現の範囲」）。修正案：description に「成人男性の壮年性脱毛症に使う」等の限定を入れる（title は現状維持も可）。法的NGと断定はしないため運営者判断。
title: "ミノキシジル5%の市販発毛剤4商品｜「発毛」まで承認された第1類医薬品の選び方"
description: "この記事で紹介するミノキシジル5%配合の外用発毛剤4商品は、いずれも「発毛」まで効能・効果として承認された第1類医薬品です。日本皮膚科学会ガイドラインでの評価と比較試験のデータ、主要4商品の価格・内容量・成分・容器・購入方法の違いを整理します。"
dateModified: "2026-09-15"
affiliate: true

conclusion:
  # COMPLIANCE-REVIEW: (1)「発毛」に「壮年性脱毛症における」「成人男性」の限定が無い（title と同じ論点）。(2) 第2文が「今回紹介する4商品は」の主語を引き継ぎ、学会が4商品を推奨度Aと評価したように読める。ガイドラインの評価対象は「男性型脱毛症に対する5%ミノキシジル外用」で個別商品ではない。直下に各商品CTAが並ぶ位置のため、医薬品等適正広告基準「医薬関係者等の推薦」、A8「医療関係者の推薦表現」に近づく。修正案A：第2文を「日本皮膚科学会の診療ガイドラインでは、男性型脱毛症に対する5%ミノキシジル外用が推奨度A（行うよう強く勧める）とされています。」とする。修正案B：結論からガイドラインの文を外す。運営者判断。
  issue1: "今回紹介する4商品は、いずれもミノキシジル5%を配合した第1類医薬品で、「発毛」まで効能・効果として承認されています。日本皮膚科学会の診療ガイドラインでも、推奨度A（行うよう強く勧める）です。"

issueOne:
  title: "ミノキシジル5%の外用発毛剤に期待できること"
  blocks:
    - title: "「発毛」まで効能・効果として承認されている"
      paragraphs:
        - "今回紹介するミノキシジル5%配合の外用発毛剤は、いずれも第1類医薬品として承認されています。同じ売り場に並ぶ医薬部外品の育毛剤とは、承認の区分が異なります。"
        - "注目したいのは、承認された効能・効果に「発毛」が含まれている点です。抜け毛の進行を抑える、育毛を助けるといった働きだけでなく、毛が生えることまでが承認された範囲に入っています。"
      visual:
        type: "key-benefit"
        items:
          - label: "育毛"
          - label: "抜け毛の進行予防"
          - label: "発毛"
            highlight: true
        note: "承認された効能・効果は「壮年性脱毛症における発毛、育毛及び脱毛（抜け毛）の進行予防」"

    # COMPLIANCE-REVIEW: 学会ガイドラインの推奨度を大きな評価カードで見せ、「専門家の学会が研究をもとに評価している点に意味があります」と権威づけている。商品名は出していないが同一ページで商品CTAに接続するため、医薬品等適正広告基準「医薬関係者等の推薦」、A8「医療関係者の推薦表現」「医学的根拠の引用」に該当しうる。修正案：visual.subject を「男性型脱毛症に対する5%ミノキシジル外用」にして対象を明確化／第2段落を削除／現状維持。A8規約の判断を含むため運営者判断。
    - title: "診療ガイドラインでも推奨度A"
      paragraphs:
        - "日本皮膚科学会は、医師が診療に使うための脱毛症のガイドラインをまとめています。治療法ごとに推奨度が付けられ、その根拠になった研究も示されています。"
        - "メーカー自身の説明ではなく、専門家の学会が研究をもとに評価している点に意味があります。"
      visual:
        type: "rating"
        source: "日本皮膚科学会 男性型および女性型脱毛症診療ガイドライン2017年版"
        subject: "5%ミノキシジル外用"
        gradeLabel: "推奨度"
        grade: "A"
        meaning: "行うよう強く勧める"

    # COMPLIANCE-REVIEW: 一般向け広告での臨床データ（Olsen 2002 の毛数増加）の例示。医薬品等適正広告基準の解説（効能効果等又は安全性を保証する表現の禁止）では、一般向け広告で臨床データ等を例示することは原則行わないとされ、A8も「医学的根拠の引用」を例示している。stats は条件（48週・脱毛部1cm²あたりの増加・海外試験）を付けずに「18.6本／3.9本」だけを大きく表示し、本文の「はっきり増えました」も効果の強調になる。「4商品そのものの試験ではない」の注記はあるが、打ち消し表示では救済されない。修正案：ブロックごと削除／stats を削除し条件付きの文章と dataComparison のみ残す／現状維持。Issue① の構成に関わるため運営者判断。
    - title: "プラセボと比べた試験でも毛数が増えている"
      paragraphs:
        - "ガイドラインが根拠として挙げている研究のひとつに、プラセボを対照に置いた比較試験があります。有効成分を抜いた基剤だけを塗ったプラセボグループと比べ、5%ミノキシジルを塗ったグループでは毛の数がはっきり増えました。"
      visual:
        type: "stats"
        items:
          - label: "5%ミノキシジル"
            value: "18.6本"
            highlight: true
          - label: "プラセボ"
            value: "3.9本"
      dataComparison:
        unit: "本"
        scaleMax: 20
        groups:
          - label: "48週間後の毛数の増加（脱毛部1cm²あたりの非軟毛数）"
            rows:
              - label: "プラセボ（基剤のみ）"
                actual: 3.9
              - label: "2%ミノキシジル"
                actual: 12.7
              - label: "5%ミノキシジル"
                actual: 18.6
                highlight: true
        note: "海外の18〜49歳の男性393名が対象です。プラセボは無治療ではなく、有効成分を抜いた基剤を塗っています。今回紹介する4商品そのものを使った試験ではありません。"

    - title: "ここまでのまとめ"
      paragraphs:
        - "効能・効果として「発毛」まで承認されていること、診療ガイドラインでの推奨度A、そしてプラセボと比べた毛数の増加。ミノキシジル5%の外用発毛剤には、こうした裏づけがあります。"
        - "ここから先は、どの商品を選ぶかという話になります。"

comparisonLead: "今回の4商品は、ミノキシジルの濃度（100mL中5.0g）も、承認されている効能・効果も、1日2回1回1mLという使い方も同じです。この記事では、価格・内容量・ミノキシジル以外の有効成分・容器・購入方法の5点を中心に比較します。"

products:
  - productId: "angfa-scalpd-medical-minoki5-premium-60"
    name: "スカルプD メディカルミノキ5 プレミアム"
    maker: "アンファー（販売元）／東亜薬品（製造販売元）"
    price: "7,800円（税込・公式サイト記載価格）"
    volume: "60mL"
    keyPoint: "クッションラバーヘッド採用の容器"
    affiliateProvider: "a8-rakuten"
    image: "https://thumbnail.image.rakuten.co.jp/@0_mall/angfa/cabinet/10539148/10539151/mm_4.jpg?_ex=128x128"
    affiliateLabel: "楽天市場で商品を見る"
    affiliateUrl: "https://rpx.a8.net/svt/ejp?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00ps334.2bo117d3.g00ps334.2bo12d93%2Fa26082750148_4BAFPJ_9N3QGI_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fangfa%252Fmm5%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Fangfa%252Fi%252F10007647%252F%26rafcid%3Dwsc_i_is_a9f492a7-8ef9-40e2-ab89-4bc43a1ee283"
    trackingPixel: "https://www19.a8.net/0.gif?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT"
    overview:
      - "やわらかいクッションラバーヘッドを採用し、頭皮に押し当ててタップしながら塗るタイプです。"
      - "液だれやヘッド側面の液漏れに配慮した設計で、公式サイトでは「しっとりとした使用感」を特徴として紹介しています。"
      - "ミノキシジル以外の有効成分は3種類です。"
    supportingFacts:
      - "1本の使用日数：30日分"
      - "ミノキシジル以外の有効成分：3種"
      - "容器：頭皮に押し込んで使うクッションラバーヘッド"
      - "購入方法：一般の店舗と公式ストア"

  - productId: "taisho-riup-x5-charge-60"
    name: "リアップX5チャージ"
    maker: "大正製薬"
    price: "8,140円（税込・希望小売価格）"
    volume: "60mL"
    keyPoint: "ミノキシジル以外に7種の有効成分"
    affiliateProvider: "a8-rakuten"
    image: "https://thumbnail.image.rakuten.co.jp/@0_mall/kenkocom/cabinet/040/4987306058040.jpg?_ex=128x128"
    affiliateLabel: "楽天市場で商品を見る"
    affiliateUrl: "https://rpx.a8.net/svt/ejp?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00pl1p4.2bo11b29.g00pl1p4.2bo1257b%2Fa26082750148_4BAFPJ_9N3QGI_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fkenkocom%252F4987306058040%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Fkenkocom%252Fi%252F12205813%252F%26rafcid%3Dwsc_i_is_a9f492a7-8ef9-40e2-ab89-4bc43a1ee283"
    trackingPixel: "https://www19.a8.net/0.gif?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT"
    overview:
      - "ミノキシジル以外に7種の有効成分を配合しており、今回の4商品の中では追加成分が多い商品です。"
      - "ただし、承認されている効能・効果は4商品とも同じです。成分の数が多いことだけで、効果が高いとは判断できません。"
    supportingFacts:
      - "1本の使用日数：30日分（1日2mLからの換算）"
      - "ミノキシジル以外の有効成分：7種"
      - "購入方法：一般の店舗と公式通販"

  - productId: "towa-mino-plus-72"
    name: "Minoプラス"
    maker: "東和薬品（発売元）"
    price: "5,940円（税込・公式通販価格）"
    volume: "72mL"
    keyPoint: "1本72mLで36日分。通販限定"
    affiliateProvider: "a8-rakuten"
    image: "https://thumbnail.image.rakuten.co.jp/@0_mall/towayakuhin/cabinet/10256132/shouhin/minoplus_1.jpg?_ex=128x128"
    affiliateLabel: "楽天市場で商品を見る"
    affiliateUrl: "https://rpx.a8.net/svt/ejp?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00u2584.2bo1182c.g00u2584.2bo12631%2Fa26082750148_4BAFPJ_9N3QGI_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Ftowayakuhin%252F10000021%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Ftowayakuhin%252Fi%252F10000022%252F%26rafcid%3Dwsc_i_is_a9f492a7-8ef9-40e2-ab89-4bc43a1ee283"
    trackingPixel: "https://www19.a8.net/0.gif?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT"
    # COMPLIANCE-REVIEW: overview「購入できるのは公式通販に限られます」、supportingFacts「購入方法：東和薬品ヘルスケアオンライン限定」と、CTA「楽天市場で商品を見る」（遷移先 item.rakuten.co.jp/towayakuhin/）が矛盾して読める。楽天の当該ショップが東和薬品の公式店舗か、同一商品かは未確認。購入経路の記述とCTAの食い違いは読者の誤認につながる。販売経路の事実確認（researcher / citation-editor）後に、記述とCTAのどちらに合わせるかを運営者判断。
    overview:
      - "1本72mLで36日分と、今回の4商品の中では1本あたりの使用期間が長めです。"
      - "一方、購入できるのは公式通販に限られます。なくなったときに店頭で買い足す、という使い方はできません。"
    supportingFacts:
      - "1本の使用日数：36日分"
      - "ミノキシジル以外の有効成分：4種"
      - "購入方法：東和薬品ヘルスケアオンライン限定"

  - productId: "rohto-regro-ex5-energy-60"
    name: "リグロEX5エナジー"
    maker: "ロート製薬"
    price: "5,940円（税込・希望小売価格）"
    volume: "60mL"
    # COMPLIANCE-REVIEW: keyPoint「60mLで5,940円」は結論ボックスで価格種別（希望小売価格）なしに表示され、直下のCTAの遷移先（楽天市場）の販売価格とは一致しない可能性がある。4商品中この商品だけ keyPoint に価格が出ており、同額の Minoプラス（公式通販価格）とは価格種別も異なる。有利誤認とまでは断定しない。修正案：「60mLで5,940円（希望小売価格）。店頭でも買える」とする／keyPoint から価格を外す。運営者判断。
    keyPoint: "60mLで5,940円。店頭でも買える"
    affiliateProvider: "a8-rakuten"
    image: "https://thumbnail.image.rakuten.co.jp/@0_mall/rohtore96/cabinet/thumb/1974r1_v2.jpg?_ex=128x128"
    affiliateLabel: "楽天市場で商品を見る"
    affiliateUrl: "https://rpx.a8.net/svt/ejp?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00t9ia4.2bo11be0.g00t9ia4.2bo12c60%2Fa26082750148_4BAFPJ_9N3QGI_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Frohtore96%252F1974r1%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Frohtore96%252Fi%252F10000055%252F%26rafcid%3Dwsc_i_is_a9f492a7-8ef9-40e2-ab89-4bc43a1ee283"
    trackingPixel: "https://www11.a8.net/0.gif?a8mat=4BAFPJ+9N3QGI+2HOM+BWGDT"
    overview:
      - "ミノキシジル以外の有効成分は4種類。公式ストアでは、そのうちパントテニールエチルエーテルを頭皮環境を整える成分として説明しています。"
      - "キャップを開けるとノズルが上がり、頭皮に垂直に押し込むと1回分の1mLが計量されます。"
      - "1本60mLで約1ヵ月分。通販限定ではないので、店頭で買い足す使い方もできます。"
    supportingFacts:
      - "1本の使用日数：約1ヵ月分"
      - "ミノキシジル以外の有効成分：4種"
      - "容器：キャップを開けるとノズルが上がる計量式"
      - "購入方法：一般の店舗と公式ストア"

purchaseNotes:
  - "成人男性（20歳以上）の壮年性脱毛症に使う、第1類医薬品です。"
  - "女性や20歳未満の方は使用できないほか、体質や持病によっては使用前に相談が必要な場合があります。"
  - "毛髪が成長するには時間がかかるため、効果がわかるようになるまで少なくとも4か月間、1日2回の使用を続けるよう案内されています。"
  - "副作用を含む詳しい注意は、購入時の薬剤師の説明と添付文書で確認してください。"

sources:
  - label: "日本皮膚科学会 男性型および女性型脱毛症診療ガイドライン2017年版（PDF）"
    url: "https://www.dermatol.or.jp/uploads/uploads/files/AGA_GL2017.pdf"
    checkedAt: "2026-09-11"
  - label: "Minds ガイドラインライブラリ（公益財団法人日本医療機能評価機構）掲載ページ"
    url: "https://minds.jcqhc.or.jp/summary/c00458/"
    checkedAt: "2026-09-11"
  - label: "Olsen EA, et al. A randomized clinical trial of 5% topical minoxidil versus 2% topical minoxidil and placebo in the treatment of androgenetic alopecia in men. J Am Acad Dermatol. 2002;47(3):377-385."
    url: "https://pubmed.ncbi.nlm.nih.gov/12196747/"
    checkedAt: "2026-09-11"
  - label: "厚生労働省医薬・生活衛生局総務課 事務連絡「第一類医薬品の販売等における情報提供の取扱について」（平成29年8月4日）"
    url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc4197&dataType=1&pageNo=1"
    checkedAt: "2026-09-11"
  - label: "アンファー 公式ニュースリリース（スカルプD メディカルミノキ5 プレミアム）"
    url: "https://www.angfa.jp/news/?p=6518"
    checkedAt: "2026-09-11"
  - label: "スカルプD 公式ブランドサイト（メディカルミノキ5 プレミアム）"
    url: "https://scalp-d.com/brand/medicalminoxi5/"
    checkedAt: "2026-09-11"
  - label: "大正製薬 公式製品カタログ（リアップX5チャージ）"
    url: "https://www.catalog-taisho.com/category/03/001/05804/"
    checkedAt: "2026-09-11"
  - label: "東和薬品ヘルスケアオンライン（Minoプラス）"
    url: "https://shop.towayakuhin.co.jp/Page/minoplus"
    checkedAt: "2026-09-11"
  - label: "リョートーファイン 製品詳細情報（Minoプラス）"
    url: "https://www.ryo-to.co.jp/mino_plus.html"
    checkedAt: "2026-09-11"
  - label: "ロート製薬 公式商品情報（リグロEX5エナジー）"
    url: "https://jp.rohto.com/regro/ex5energy/"
    checkedAt: "2026-09-11"
  - label: "REGRO 公式ストア（リグロEX5エナジー）"
    url: "https://www.regro.rohto.co.jp/shop/pages/4987241166947"
    checkedAt: "2026-09-11"

priceNote: "価格は2026年9月11日時点で各メーカー公式が提示している税込価格です。価格の種別は商品によって異なり、店頭の実売価格とは異なる場合があります。"
---
