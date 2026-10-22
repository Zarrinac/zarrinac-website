import type { CategorySeoContent, CategorySeoKey } from '@/lib/seo/categorySeoContent';
import type { Locale } from '@/i18n/routing';

// zarrinac.com's own category copy + FAQs (selected in categorySeoContent.ts when
// SITE_ID is 'zarrinac'). hisense-ir.com publishes the same catalog under the same
// paths, so the indexable copy on these pages is written separately here: same facts
// and the same models, different wording, headings and questions, told from the
// distributor's side (Zarrin Namaye Caspian — supply, network, installation, parts)
// rather than as a Hisense brand page. Keep it factually aligned with the default copy
// (no prices, no claims the catalog does not support) but never paste it across, or the
// two domains fold into one duplicate cluster again — see CLAUDE.md, "Homepage
// differentiation".

export const ZARRINAC_CATEGORY_SEO_CONTENT: Record<
  CategorySeoKey,
  Record<Locale, CategorySeoContent>
> = {
  tvs: {
    fa: {
      heading: 'تلویزیون هایسنس از زرین نمای کاسپین؛ انتخاب، خرید و خدمات',
      paragraphs: [
        'صنایع زرین نمای کاسپین تلویزیون‌های هایسنس را در مدل‌های U7K، Q7Q، Q6Q، A4AN و A3Q به بازار ایران عرضه می‌کند. این مدل‌ها از نظر نوع پنل، وضوح تصویر، اندازه صفحه و امکانات هوشمند با هم تفاوت دارند و جزئیات هر کدام در صفحه همان مدل آمده است.',
        'هر تلویزیونی که از مسیر زرین نمای کاسپین و فروشندگان مجاز آن به دست مشتری می‌رسد، کالای اصل با گارانتی رسمی است و پس از خرید هم شبکه سراسری نمایندگان خدمات این شرکت پشتیبان آن است؛ از نصب و راه‌اندازی تا تعمیر و تأمین قطعه.',
        'پیش از خرید، اندازه صفحه را با فاصله تماشا بسنجید و وضوح تصویر، نرخ نوسازی، تعداد و نوع ورودی‌ها و امکانات هوشمند مدل‌ها را کنار هم بگذارید؛ پشتیبانی از VIDAA و Dolby Vision در همه مدل‌ها یکسان نیست. برای استعلام قیمت روز با زرین نمای کاسپین یا یکی از فروشندگان مجاز آن تماس بگیرید.',
      ],
      faqHeading: 'پرسش‌های رایج خریداران تلویزیون هایسنس',
      faqs: [
        {
          question: 'چطور مطمئن شوم تلویزیون هایسنسی که می‌خرم اصل است؟',
          answer:
            'تلویزیون را از زرین نمای کاسپین یا فروشندگان مجاز آن بخرید؛ کالایی که از این مسیر عرضه می‌شود اصل است و گارانتی رسمی و خدمات پس از فروش سراسری دارد.',
        },
        {
          question: 'ULED و Mini-LED در تلویزیون‌های هایسنس چه فرقی دارند؟',
          answer:
            'ULED نام مجموعه فناوری‌های هایسنس برای بهبود رنگ و کنتراست تصویر است؛ Mini-LED با نورپردازی پشت صفحه‌ای که دقیق‌تر کنترل می‌شود، روشنایی و کنتراست بالاتری می‌دهد.',
        },
        {
          question: 'تلویزیون‌های هوشمند هایسنس با چه سیستم‌عاملی کار می‌کنند؟',
          answer:
            'بیشتر مدل‌های هوشمند هایسنس سیستم‌عامل VIDAA دارند که دسترسی سریع به اپلیکیشن‌ها و سرویس‌های پخش آنلاین را فراهم می‌کند؛ مشخصات دقیق هر مدل در صفحه محصول آمده است.',
        },
        {
          question: 'قیمت روز تلویزیون هایسنس را از کجا بپرسم؟',
          answer:
            'قیمت به مدل، اندازه و فناوری تصویر بستگی دارد. برای قیمت روز و شرایط فروش از صفحه تماس با زرین نمای کاسپین یا فروشندگان مجاز آن استعلام بگیرید.',
        },
        {
          question: 'بعد از خرید، تعمیر و خدمات تلویزیون هایسنس با کیست؟',
          answer:
            'خدمات پس از فروش را نمایندگان مجاز خدمات زرین نمای کاسپین انجام می‌دهند؛ نزدیک‌ترین نماینده را در صفحه «لیست نمایندگان خدمات» بر اساس استان و شهر پیدا کنید.',
        },
      ],
    },
    en: {
      heading: 'Hisense TVs from Zarrin Namaye Caspian: choosing, buying and service',
      paragraphs: [
        'Zarrin Namaye Caspian brings the Hisense U7K, Q7Q, Q6Q, A4AN and A3Q televisions to the Iranian market. Panel type, resolution, screen size and smart features differ between them, and each model’s page lists its full specifications.',
        'Every TV that reaches a customer through Zarrin Namaye Caspian and its authorized dealers is genuine stock with an official warranty, backed after purchase by the company’s nationwide network of service representatives — installation, repair and parts included.',
        'Before you buy, match the screen size to your viewing distance and compare resolution, refresh rate, inputs and smart features side by side; VIDAA and Dolby Vision support vary by model. For a current price, contact Zarrin Namaye Caspian or one of its authorized dealers.',
      ],
      faqHeading: 'Common questions from Hisense TV buyers',
      faqs: [
        {
          question: 'How can I be sure the Hisense TV I buy is genuine?',
          answer:
            'Buy from Zarrin Namaye Caspian or one of its authorized dealers: stock supplied through that channel is genuine and carries the official warranty and nationwide after-sales service.',
        },
        {
          question: 'How do ULED and Mini-LED differ on Hisense TVs?',
          answer:
            'ULED is Hisense’s set of picture technologies for colour and contrast; Mini-LED uses a more finely controlled backlight for higher brightness and contrast.',
        },
        {
          question: 'Which operating system do Hisense smart TVs run?',
          answer:
            'Most Hisense smart models run VIDAA, which gives quick access to apps and streaming services; each product page lists the exact specification.',
        },
        {
          question: 'Where do I ask for a current Hisense TV price?',
          answer:
            'Prices depend on model, size and picture technology. Ask Zarrin Namaye Caspian through the contact page, or one of its authorized dealers, for today’s price and terms.',
        },
        {
          question: 'Who handles repairs and service after I buy?',
          answer:
            'After-sales service is provided by Zarrin Namaye Caspian’s authorized service representatives; find the nearest one by province and city on the service representative list.',
        },
      ],
    },
  },
  rac: {
    fa: {
      heading: 'کولر گازی هایسنس؛ تأمین، نصب و خدمات از زرین نمای کاسپین',
      paragraphs: [
        'کولرهای گازی هایسنس که زرین نمای کاسپین عرضه می‌کند در سری‌های HIH، HRH، HRTC و HFH و در مدل‌های دیواری، اینورتر و ایستاده هستند. ظرفیت، نوع کمپرسور و مشخصات هر سری متفاوت است و در صفحه هر مدل آمده است.',
        'انتخاب درست کولر گازی از ظرفیت شروع می‌شود: متراژ و شرایط فضا را با ظرفیت دستگاه (BTU) بسنجید و نوع گاز مبرد و کلاس انرژی را هم در نظر بگیرید، چون هر دو روی هزینه برق و کیفیت سرمایش اثر مستقیم دارند.',
        'نصب و راه‌اندازی، گارانتی رسمی، قطعات یدکی اصل و خدمات پس از فروش این دستگاه‌ها از طریق شبکه نمایندگان مجاز زرین نمای کاسپین در سراسر کشور انجام می‌شود. برای استعلام قیمت و هماهنگی نصب با این شرکت تماس بگیرید.',
      ],
      faqHeading: 'پرسش‌های رایج درباره خرید و نصب کولر گازی هایسنس',
      faqs: [
        {
          question: 'کولر گازی اینورتر هایسنس چه فرقی با مدل معمولی دارد؟',
          answer:
            'در مدل اینورتر دور کمپرسور به‌طور پیوسته تنظیم می‌شود؛ نتیجه آن مصرف برق کمتر، دمای پایدارتر و صدای کمتر دستگاه است.',
        },
        {
          question: 'برای اتاق یا سالن من کولر گازی چند هزار BTU لازم است؟',
          answer:
            'به متراژ و شرایط فضا بستگی دارد؛ مدل‌های ۹۰۰۰ تا ۳۰۰۰۰ BTU برای فضاهای کوچک تا بزرگ عرضه می‌شوند. برای انتخاب دقیق با کارشناسان زرین نمای کاسپین مشورت کنید.',
        },
        {
          question: 'نصب کولر گازی هایسنس را چه کسی انجام می‌دهد؟',
          answer:
            'نصب و راه‌اندازی را نمایندگان مجاز خدمات زرین نمای کاسپین در سراسر ایران انجام می‌دهند؛ نصب توسط نماینده مجاز برای حفظ گارانتی دستگاه اهمیت دارد.',
        },
        {
          question: 'گارانتی کولر گازی هایسنس را چه کسی پشتیبانی می‌کند؟',
          answer:
            'کولرهای گازی هایسنس عرضه‌شده توسط زرین نمای کاسپین گارانتی رسمی دارند و خدمات پس از فروش آن‌ها در سراسر کشور توسط همین شبکه ارائه می‌شود.',
        },
        {
          question: 'قطعه یدکی اصل کولر گازی هایسنس را از کجا تهیه کنم؟',
          answer:
            'قطعات اصل از طریق شبکه خدمات پس از فروش زرین نمای کاسپین تأمین می‌شود تا عملکرد دستگاه و اعتبار گارانتی حفظ شود.',
        },
      ],
    },
    en: {
      heading:
        'Hisense air conditioners: supply, installation and service from Zarrin Namaye Caspian',
      paragraphs: [
        'The Hisense air conditioners supplied by Zarrin Namaye Caspian come in the HIH, HRH, HRTC and HFH series, as wall-mounted, inverter and floor-standing models. Capacity, compressor type and specifications differ by series and are listed on each model’s page.',
        'Choosing well starts with capacity: match the floor area and conditions of the room to the unit’s BTU rating, and weigh refrigerant type and energy class too, since both directly affect running costs and cooling quality.',
        'Installation, the official warranty, genuine spare parts and after-sales service are all handled through Zarrin Namaye Caspian’s authorized representative network across Iran. Contact the company for a quote and to arrange installation.',
      ],
      faqHeading: 'Common questions about buying and installing a Hisense air conditioner',
      faqs: [
        {
          question: 'How does a Hisense inverter AC differ from a standard one?',
          answer:
            'An inverter unit varies its compressor speed continuously, which means lower power use, steadier temperatures and quieter running.',
        },
        {
          question: 'How many BTU does my room need?',
          answer:
            'It depends on floor area and conditions; models from 9,000 to 30,000 BTU cover small to large spaces. Ask Zarrin Namaye Caspian’s team for an exact recommendation.',
        },
        {
          question: 'Who installs Hisense air conditioners?',
          answer:
            'Installation and commissioning are carried out by Zarrin Namaye Caspian’s authorized service representatives across Iran; authorized installation matters for keeping the warranty valid.',
        },
        {
          question: 'Who backs the warranty on a Hisense air conditioner?',
          answer:
            'Hisense air conditioners supplied by Zarrin Namaye Caspian carry the official warranty, serviced nationwide by the same network.',
        },
        {
          question: 'Where do I get genuine Hisense AC spare parts?',
          answer:
            'Genuine parts are supplied through Zarrin Namaye Caspian’s after-sales network, which keeps the unit performing as designed and the warranty intact.',
        },
      ],
    },
  },
  cac: {
    fa: {
      heading: 'داکت اسپلیت و تهویه تجاری هایسنس برای پروژه‌ها',
      paragraphs: [
        'برای ساختمان‌های اداری، فروشگاه‌ها و فضاهای صنعتی، زرین نمای کاسپین داکت اسپلیت‌های هایسنس سری HID را عرضه می‌کند؛ سیستم‌های کانالی که سرمایش و گرمایش یکنواخت را با بازدهی بالا در فضاهای بزرگ تأمین می‌کنند.',
        'در پروژه‌های تهویه، انتخاب دستگاه به کاربری و متراژ فضا، ظرفیت سرمایش و گرمایش، ابعاد محل نصب و طراحی کانال‌کشی وابسته است. مشخصات فنی هر مدل HID را در صفحه همان مدل ببینید.',
        'کارشناسان زرین نمای کاسپین در مشاوره فنی، تأمین تجهیزات و خدمات پس از فروش این سیستم‌ها در سراسر ایران همراه پروژه هستند. برای مشاوره و استعلام قیمت، درخواست خود را از صفحه تماس ثبت کنید.',
      ],
      faqHeading: 'پرسش‌های رایج درباره تهویه تجاری هایسنس',
      faqs: [
        {
          question: 'داکت اسپلیت هایسنس برای چه نوع ساختمان‌هایی مناسب است؟',
          answer:
            'برای فضاهای بزرگی مانند ساختمان‌های اداری، فروشگاه‌ها، رستوران‌ها و مجموعه‌های صنعتی که سرمایش و گرمایش یکپارچه نیاز دارند.',
        },
        {
          question: 'زرین نمای کاسپین در پروژه‌های تهویه تجاری چه خدماتی می‌دهد؟',
          answer:
            'مشاوره فنی، تأمین تجهیزات و خدمات پس از فروش سیستم‌های تهویه تجاری هایسنس را در سراسر کشور ارائه می‌کند.',
        },
        {
          question: 'برای استعلام قیمت پروژه چه اطلاعاتی لازم است؟',
          answer:
            'کاربری و متراژ فضا و شرایط نصب را از طریق صفحه تماس ثبت کنید تا کارشناسان زرین نمای کاسپین مشاوره فنی و قیمت متناسب با پروژه را ارائه دهند.',
        },
      ],
    },
    en: {
      heading: 'Hisense ducted and commercial air conditioning for projects',
      paragraphs: [
        'For offices, retail and industrial spaces, Zarrin Namaye Caspian supplies Hisense HID-series ducted split systems — ducted units that deliver even, efficient cooling and heating across large floor areas.',
        'On an HVAC project, the right unit depends on the building’s use and size, the cooling and heating capacity required, the installation space and the ductwork design. Each HID model’s page lists its technical specifications.',
        'Zarrin Namaye Caspian’s specialists support projects across Iran with technical consultation, equipment supply and after-sales service. Submit your request through the contact page for advice and a quote.',
      ],
      faqHeading: 'Common questions about Hisense commercial HVAC',
      faqs: [
        {
          question: 'What kind of buildings suit Hisense ducted splits?',
          answer:
            'Large spaces such as office buildings, stores, restaurants and industrial sites that need integrated cooling and heating.',
        },
        {
          question: 'What does Zarrin Namaye Caspian provide on commercial HVAC projects?',
          answer:
            'Technical consultation, equipment supply and nationwide after-sales service for Hisense commercial air conditioning systems.',
        },
        {
          question: 'What information is needed for a project quote?',
          answer:
            'Send the building’s use, floor area and installation conditions through the contact page, and Zarrin Namaye Caspian’s team will come back with technical advice and pricing for the project.',
        },
      ],
    },
  },
  wms: {
    fa: {
      heading: 'ماشین لباسشویی هایسنس؛ مقایسه مدل‌ها و خرید از نمایندگی رسمی',
      paragraphs: [
        'زرین نمای کاسپین ماشین لباسشویی هایسنس را در مدل‌های 8010 و 8012 عرضه می‌کند؛ هر دو ظرفیت ۸ کیلوگرم دارند و تفاوتشان در دور موتور، برنامه‌های شست‌وشو، ابعاد و امکانات است که در صفحه هر مدل آمده است.',
        'برای انتخاب، حجم معمول هر نوبت شست‌وشو و نوع لباس‌ها را در نظر بگیرید و دور موتور در مرحله آبگیری، کلاس انرژی و برنامه‌هایی مانند بخار ضدآلرژی و شست‌وشوی سریع را مقایسه کنید.',
        'این ماشین‌ها با گارانتی رسمی عرضه می‌شوند و نصب، تعمیر و قطعات یدکی آن‌ها از طریق نمایندگان مجاز زرین نمای کاسپین در سراسر کشور در دسترس است. برای استعلام قیمت با این شرکت یا فروشندگان مجاز آن تماس بگیرید.',
      ],
      faqHeading: 'پرسش‌های رایج درباره ماشین لباسشویی هایسنس',
      faqs: [
        {
          question: 'موتور اینورتر در لباسشویی هایسنس چه فایده‌ای دارد؟',
          answer:
            'موتور اینورتر کم‌صداتر و بادوام‌تر است، انرژی کمتری مصرف می‌کند و دور موتور را در هر برنامه دقیق‌تر تنظیم می‌کند.',
        },
        {
          question: 'تفاوت مدل‌های 8010 و 8012 هایسنس چیست؟',
          answer:
            'هر دو ظرفیت ۸ کیلوگرم دارند؛ دور موتور، برنامه‌های شست‌وشو و امکانات آن‌ها را در صفحه هر مدل کنار هم مقایسه کنید.',
        },
        {
          question: 'گارانتی و تعمیر لباسشویی هایسنس با کیست؟',
          answer:
            'لباسشویی‌های هایسنس عرضه‌شده توسط زرین نمای کاسپین گارانتی رسمی دارند و تعمیر و خدمات آن‌ها را نمایندگان مجاز این شرکت در سراسر کشور انجام می‌دهند.',
        },
        {
          question: 'لباسشویی هایسنس اصل را از کجا بخرم؟',
          answer:
            'از زرین نمای کاسپین یا فروشندگان مجاز آن؛ کالای عرضه‌شده از این مسیر اصل است و گارانتی رسمی دارد.',
        },
      ],
    },
    en: {
      heading: 'Hisense washing machines: compare models and buy from the official distributor',
      paragraphs: [
        'Zarrin Namaye Caspian supplies the Hisense 8010 and 8012 washing machines. Both hold 8 kg; they differ in spin speed, wash programs, dimensions and features, all listed on each model’s page.',
        'To choose, think about your usual load size and fabric types, then compare spin speed, energy class and programs such as anti-allergy steam and quick wash.',
        'Both machines come with the official warranty, and installation, repair and spare parts are available nationwide through Zarrin Namaye Caspian’s authorized representatives. Contact the company or its authorized dealers for a price.',
      ],
      faqHeading: 'Common questions about Hisense washing machines',
      faqs: [
        {
          question: 'What does an inverter motor bring to a Hisense washer?',
          answer:
            'It runs quieter, lasts longer, uses less energy and controls spin speed more precisely in each program.',
        },
        {
          question: 'How do the Hisense 8010 and 8012 differ?',
          answer:
            'Both have an 8 kg capacity; compare their spin speeds, programs and features side by side on the product pages.',
        },
        {
          question: 'Who handles warranty and repairs for Hisense washers?',
          answer:
            'Hisense washing machines supplied by Zarrin Namaye Caspian carry the official warranty, and the company’s authorized representatives handle repairs and service nationwide.',
        },
        {
          question: 'Where do I buy a genuine Hisense washing machine?',
          answer:
            'From Zarrin Namaye Caspian or its authorized dealers — stock supplied through that channel is genuine and carries the official warranty.',
        },
      ],
    },
  },
  refrigerator: {
    fa: {
      heading: 'یخچال فریزر هایسنس؛ ساید بای ساید، کمبی و صندوقی از زرین نمای کاسپین',
      paragraphs: [
        'یخچال‌ها و فریزرهای هایسنس که زرین نمای کاسپین عرضه می‌کند در سه گروه ساید بای ساید، کمبی و فریزر صندوقی هستند. ظرفیت، ابعاد و امکاناتی مثل No Frost، کمپرسور اینورتر و گردش هوای چندگانه به مدل بستگی دارد و در صفحه هر محصول آمده است.',
        'پیش از خرید، ابعاد محل نصب را اندازه بگیرید و ظرفیت (لیتر) را با نیاز خانواده بسنجید؛ سپس کلاس انرژی و امکاناتی مانند آب‌سردکن، یخ‌ساز و کنترل دما را بین مدل‌ها مقایسه کنید.',
        'این محصولات با گارانتی رسمی عرضه می‌شوند و خدمات پس از فروش و قطعات یدکی اصل آن‌ها از طریق شبکه نمایندگان مجاز زرین نمای کاسپین در دسترس است. برای استعلام قیمت با این شرکت تماس بگیرید.',
      ],
      faqHeading: 'پرسش‌های رایج درباره یخچال فریزر هایسنس',
      faqs: [
        {
          question: 'No Frost در یخچال هایسنس یعنی چه؟',
          answer:
            'در سیستم No Frost هوای سرد در یخچال گردش می‌کند و برفک تشکیل نمی‌شود؛ بنابراین به یخ‌زدایی دستی نیازی نیست و دما یکنواخت‌تر می‌ماند.',
        },
        {
          question: 'ساید بای ساید بخرم یا کمبی؟',
          answer:
            'به فضای آشپزخانه و نیاز شما بستگی دارد؛ مدل‌های ساید بای ساید و کمبی هایسنس در ظرفیت‌ها و ابعاد مختلف عرضه می‌شوند. ابعاد محل نصب و حجم موردنیاز را پیش از خرید بررسی کنید.',
        },
        {
          question: 'گارانتی یخچال فریزر هایسنس را چه کسی پشتیبانی می‌کند؟',
          answer:
            'یخچال فریزرهای هایسنس عرضه‌شده توسط زرین نمای کاسپین گارانتی رسمی دارند و خدمات پس از فروش آن‌ها را شبکه سراسری همین شرکت ارائه می‌دهد.',
        },
        {
          question: 'یخچال هایسنس اصل با گارانتی را از کجا بخرم؟',
          answer:
            'از زرین نمای کاسپین یا فروشندگان مجاز آن، تا کالا اصل باشد و از گارانتی رسمی و خدمات پس از فروش بهره‌مند شوید.',
        },
      ],
    },
    en: {
      heading:
        'Hisense refrigerators: side-by-side, combi and chest freezers from Zarrin Namaye Caspian',
      paragraphs: [
        'The Hisense refrigerators and freezers supplied by Zarrin Namaye Caspian come in three groups: side-by-side, combi and chest freezers. Capacity, dimensions and features such as No Frost, inverter compressors and multi-air flow depend on the model and are listed on each product page.',
        'Before buying, measure the installation space and match the capacity in litres to your household; then compare energy class and features such as a water dispenser, ice maker and temperature control across models.',
        'These appliances carry the official warranty, and after-sales service and genuine spare parts are available through Zarrin Namaye Caspian’s authorized representative network. Contact the company for a price.',
      ],
      faqHeading: 'Common questions about Hisense refrigerators',
      faqs: [
        {
          question: 'What does No Frost mean on a Hisense refrigerator?',
          answer:
            'Cold air circulates through the cabinet so frost never builds up — no manual defrosting, and a more even temperature.',
        },
        {
          question: 'Should I choose a side-by-side or a combi?',
          answer:
            'It depends on your kitchen and needs; Hisense side-by-side and combi models come in several capacities and sizes. Check the installation space and the volume you need before buying.',
        },
        {
          question: 'Who backs the warranty on a Hisense refrigerator?',
          answer:
            'Hisense refrigerators supplied by Zarrin Namaye Caspian carry the official warranty, serviced by the company’s nationwide network.',
        },
        {
          question: 'Where do I buy a genuine Hisense refrigerator with a warranty?',
          answer:
            'From Zarrin Namaye Caspian or its authorized dealers, so the appliance is genuine and covered by the official warranty and after-sales service.',
        },
      ],
    },
  },
};
