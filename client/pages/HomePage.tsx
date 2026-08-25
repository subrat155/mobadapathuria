import React from 'react';
import {
  Users,
  MapPin,
  School,
  HeartPulse,
  ArrowRight,
  Info,
  TrendingUp,
  Store,
  Briefcase,
  Megaphone,
  Calendar,
  Camera,
  ChevronRight,
  Star,
  Quote,
  History,
  ScrollText,
  HandCoins,
  WalletCards,
  IndianRupee,
  User
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from 'recharts';

import {
  ECONOMY_DATA,
  EVENTS_CHART_DATA,
  COLORS
} from '../constants';

import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

const HomePage: React.FC = () => {

  const {
    homeConfig,
    notices,
    villagers,
    gallery,
    reviews,
    pujas
  } = useApp();

  const recentNotices = [...notices]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5);

  const PIE_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.primaryDark
  ];

  const renderAnimatedHeading = (text: string) => {
    const target = "Badapathuria";

    if (!text.includes(target)) return text;

    const parts = text.split(target);

    return (
      <>
        {parts[0]}
        <span className="animate-badapathuria">
          {target}
        </span>
        {parts[1]}
      </>
    );
  };

  return (

    <div className="animate-in fade-in duration-700">

      {/* =====================================================
          RECENT NOTICES TICKER
      ===================================================== */}

      {recentNotices.length > 0 && (

        <div className="sticky top-[72px] z-40 bg-black text-white overflow-hidden border-b border-white/10 shadow-md">

          <div className="flex items-center h-12">

            <div className="relative z-20 flex-shrink-0 bg-[#88AB8E] h-full px-5 flex items-center gap-2 font-bold text-sm shadow-lg">

              <Megaphone size={16} />

              <span className="hidden sm:inline">
                Recent Notices
              </span>

            </div>

            <div className="relative overflow-hidden flex-1 h-full flex items-center">

              <div className="notice-marquee flex items-center whitespace-nowrap">

                {recentNotices.map((notice) => (

                  <Link
                    key={`first-${notice.id}`}
                    to="/notices"
                    className="inline-flex items-center gap-3 mx-8 text-sm hover:text-[#88AB8E] transition-colors"
                  >

                    <span className="w-2 h-2 rounded-full bg-[#88AB8E] flex-shrink-0" />

                    <span className="font-semibold">
                      {notice.title}
                    </span>

                    <span className="text-white/40">
                      {notice.date}
                    </span>

                  </Link>

                ))}

                {recentNotices.map((notice) => (

                  <Link
                    key={`second-${notice.id}`}
                    to="/notices"
                    className="inline-flex items-center gap-3 mx-8 text-sm hover:text-[#88AB8E] transition-colors"
                  >

                    <span className="w-2 h-2 rounded-full bg-[#88AB8E] flex-shrink-0" />

                    <span className="font-semibold">
                      {notice.title}
                    </span>

                    <span className="text-white/40">
                      {notice.date}
                    </span>

                  </Link>

                ))}

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative min-h-[500px] md:h-[600px] overflow-hidden flex items-center">

        <img
          src={homeConfig.heroImageUrl}
          alt="Badapathuria Village"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white py-20">

          <div className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/20 mb-4 w-fit">
            Official Portal
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight max-w-2xl whitespace-pre-line">

            {renderAnimatedHeading(
              homeConfig.welcomeHeading
            )}

          </h1>

          <p className="text-base md:text-xl text-white/90 max-w-xl mb-8 leading-relaxed">

            {homeConfig.welcomeSubheading}

          </p>

          <div className="flex flex-wrap gap-4">

            <Link
              to="/notices"
              className="bg-[#88AB8E] hover:bg-[#6B8A7A] text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition-all"
            >
              Latest Notices
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/services"
              className="bg-white hover:bg-gray-100 text-black px-8 py-3.5 rounded-full font-bold transition-all"
            >
              Explore Services
            </Link>

          </div>

        </div>

      </section>
{/* =====================================================
    STAT CARDS
===================================================== */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-20">

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* POPULATION */}
    <div
      className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-[#88AB8E]/10 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform"
    >
      <div className="p-3 bg-[#88AB8E]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
        <Users className="text-[#88AB8E]" />
      </div>

      <span className="text-xs font-bold tracking-widest text-black/50 mb-1">
        POPULATION
      </span>

      <div className="text-4xl font-bold text-black">
        {villagers.length + 300}
      </div>

      <span className="text-xs font-medium text-[#88AB8E] mt-1">
        RESIDENTS
      </span>
    </div>


    {/* ACTIVE NOTICES */}
    <div
      className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-[#88AB8E]/10 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform"
    >
      <div className="p-3 bg-[#88AB8E]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
        <Info className="text-[#88AB8E]" />
      </div>

      <span className="text-xs font-bold tracking-widest text-black/50 mb-1">
        ACTIVE NOTICES
      </span>

      <div className="text-4xl font-bold text-black">
        {notices.length}
      </div>

      <span className="text-xs font-medium text-[#88AB8E] mt-1">
        UPDATES
      </span>
    </div>


    {/* PUJA CONTRIBUTIONS */}
    <div
      className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-[#88AB8E]/10 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform"
    >
      <div className="p-3 bg-[#88AB8E]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
        <HandCoins className="text-[#88AB8E]" />
      </div>

      <span className="text-xs font-bold tracking-widest text-black/50 mb-1">
        PUJA CONTRIBUTIONS
      </span>

      <div className="text-4xl font-bold text-black">
        {pujas.length}
      </div>

      <span className="text-xs font-medium text-[#88AB8E] mt-1">
        ENTRIES
      </span>

      {/* VIEW MORE INSIDE 3RD CARD */}
      <Link
        to="/puja"
        className="mt-6 bg-[#88AB8E] hover:bg-[#6B8A7A] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#88AB8E]/20 transition-all hover:scale-105"
      >
        View Contributions
        <ArrowRight size={18} />
      </Link>
    </div>

  </div>

</section>

      {/* =====================================================
          VILLAGE STATISTICS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        <div className="bg-white p-6 md:p-12 rounded-[40px] shadow-2xl shadow-black/5 border border-[#88AB8E]/10">

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">

            <div>

              <h3 className="text-2xl md:text-3xl font-bold text-black">
                ଗାଁର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପରିସଂଖ୍ୟାନ
              </h3>

              <p className="text-black/40 font-medium text-sm">
                ପ୍ରକୃତ ସମୟରେ ବଡପଥୁରିଆର ପ୍ରଗତି ତଦାରଖ କରିବା
              </p>

            </div>

            <div className="bg-[#88AB8E]/10 text-[#88AB8E] px-4 py-2 rounded-2xl text-[10px] md:text-xs font-bold tracking-widest uppercase w-fit">
              Panchayat Verified
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            <div>

              <p className="text-sm font-bold text-black/40 mb-6 uppercase tracking-wider flex items-center gap-2">

                <TrendingUp size={14} />

                ସମ୍ପ୍ରଦାୟର ଅଂଶଗ୍ରହଣ

              </p>

              <div className="h-[250px] md:h-[300px] w-full">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={EVENTS_CHART_DATA}>

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#00000066',
                        fontSize: 10
                      }}
                    />

                    <Tooltip
                      cursor={{
                        fill: '#88AB8E11'
                      }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow:
                          '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                    />

                    <Bar
                      dataKey="count"
                      fill={COLORS.primary}
                      radius={[6, 6, 0, 0]}
                      barSize={30}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>


            <div className="pt-10 lg:pt-0 lg:pl-16 lg:border-l border-gray-100">

              <p className="text-sm font-bold text-black/40 mb-6 uppercase tracking-wider flex items-center gap-2">

                <Briefcase size={14} />

                Employment Sectors

              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">

                <div className="h-[200px] w-[200px] flex-shrink-0">

                  <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                      <Pie
                        data={ECONOMY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >

                        {ECONOMY_DATA.map((entry, index) => (

                          <Cell
                            key={`cell-${index}`}
                            fill={
                              PIE_COLORS[
                                index % PIE_COLORS.length
                              ]
                            }
                            stroke="none"
                          />

                        ))}

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                <div className="space-y-4 w-full">

                  {ECONOMY_DATA.map((item, i) => (

                    <div
                      key={i}
                      className="flex items-center gap-4"
                    >

                      <div
                        className="w-4 h-4 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: PIE_COLORS[i]
                        }}
                      />

                      <div className="flex-1">

                        <div className="text-sm font-bold text-black">
                          {item.name}
                        </div>

                        <div className="text-xs text-black/40 font-medium">
                          {item.value}% of households
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


   {/* =====================================================
    PUJA CONTRIBUTIONS - USER UI
===================================================== */}

<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

  <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-[#88AB8E]/10 overflow-hidden">

    {/* Header */}
    <div className="p-6 md:p-10 border-b border-gray-100">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-3 mb-2">

            <div className="p-3 bg-[#88AB8E]/10 text-[#88AB8E] rounded-2xl">
              <HandCoins size={24} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Puja Contributions
            </h2>

          </div>

          <p className="text-sm text-black/40">
            Village puja contributions recorded by members.
          </p>

        </div>

        <div className="bg-[#88AB8E]/10 text-[#6B8A7A] px-5 py-3 rounded-2xl font-bold text-sm">
          {pujas.length} Contributions
        </div>

      </div>

    </div>


    {/* ==============================
        SHOW ONLY 3 PUJA RECORDS
    ============================== */}

    {pujas.length === 0 ? (

      <div className="p-10 md:p-20 text-center">

        <div className="w-16 h-16 mx-auto mb-5 bg-[#88AB8E]/10 rounded-2xl flex items-center justify-center">

          <HandCoins
            size={30}
            className="text-[#88AB8E]/50"
          />

        </div>

        <h3 className="font-bold text-black text-lg mb-2">
          No Puja Contributions
        </h3>

        <p className="text-sm text-black/40">
          No puja contribution has been recorded yet.
        </p>

      </div>

    ) : (

      <>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px]">

            <thead>

              <tr className="bg-[#F9F8F4] text-left">

                <th className="px-6 md:px-8 py-5 text-xs font-bold uppercase tracking-wider text-black/40">
                  Puja Name
                </th>

                <th className="px-6 md:px-8 py-5 text-xs font-bold uppercase tracking-wider text-black/40">
                  Member
                </th>

                <th className="px-6 md:px-8 py-5 text-xs font-bold uppercase tracking-wider text-black/40">
                  Amount
                </th>

                <th className="px-6 md:px-8 py-5 text-xs font-bold uppercase tracking-wider text-black/40">
                  Payment Mode
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-100">

              {[...pujas]
                .reverse()
                .slice(0, 3)
                .map((puja) => (

                  <tr
                    key={puja.id}
                    className="hover:bg-[#F9F8F4]/70 transition-colors"
                  >

                    {/* PUJA NAME */}

                    <td className="px-6 md:px-8 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-[#88AB8E]/10 rounded-xl flex items-center justify-center">

                          <HandCoins
                            size={18}
                            className="text-[#88AB8E]"
                          />

                        </div>

                        <div>

                          <p className="font-bold text-black">
                            {puja.pujaName}
                          </p>

                          <p className="text-[10px] uppercase tracking-wider text-[#88AB8E] font-bold">
                            Village Puja
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* MEMBER */}

                    <td className="px-6 md:px-8 py-5">

                      <div className="flex items-center gap-2">

                        <User
                          size={16}
                          className="text-[#88AB8E]"
                        />

                        <span className="text-sm font-medium text-black/70">
                          {puja.memberName}
                        </span>

                      </div>

                    </td>


                    {/* AMOUNT */}

                    <td className="px-6 md:px-8 py-5">

                      <div className="flex items-center gap-1 font-bold text-black">

                        <IndianRupee size={15} />

                        {Number(puja.amount).toLocaleString('en-IN')}

                      </div>

                    </td>


                    {/* PAYMENT MODE */}

                    <td className="px-6 md:px-8 py-5">

                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                          puja.paymentMode === 'Cash'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >

                        {puja.paymentMode === 'Cash' ? (
                          <HandCoins size={13} />
                        ) : (
                          <WalletCards size={13} />
                        )}

                        {puja.paymentMode}

                      </span>

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>


        {/* ==============================
            VIEW MORE
        ============================== */}

        {pujas.length > 3 && (

          <div className="flex justify-center py-8 border-t border-gray-100">

            <Link
        to="/puja"
        className="mt-6 bg-[#88AB8E] hover:bg-[#6B8A7A] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#88AB8E]/20 transition-all hover:scale-105"
      >
        View More contributions
        <ArrowRight size={18} />
      </Link>

          </div>

        )}

      </>

    )}

  </div>

</section>

      {/* =====================================================
          VILLAGE HISTORY
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        <div className="bg-[#F9F8F4] p-8 md:p-16 rounded-[40px] border border-[#88AB8E]/20 relative overflow-hidden group">

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">

            <div className="lg:w-1/3">

              <div className="bg-[#88AB8E]/10 w-fit p-4 rounded-3xl mb-6 group-hover:bg-[#88AB8E] group-hover:text-white transition-all">

                <History size={40} />

              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                ବଡପଥୁରିଆ ଗ୍ରାମର ଇତିହାସ
              </h2>

              <div className="h-1.5 w-24 bg-[#88AB8E] rounded-full mb-6" />

              <p className="text-[#88AB8E] font-bold text-sm tracking-widest uppercase mb-8">
                ୨୦୦ ବର୍ଷର ଐତିହ୍ୟ
              </p>

            </div>

            <div className="lg:w-2/3 space-y-6">

              <p className="text-black/70 text-base md:text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-[#88AB8E] first-letter:mr-3 first-letter:float-left">
                ବଡ଼ପଥୁରିଆ ହେଉଛି ପ୍ରାୟ ଦୁଇ ଶତାବ୍ଦୀ ଧରି ଇତିହାସ ଥିବା ଏକ ଗ୍ରାମ। ପ୍ରାୟ 150-200 ବର୍ଷ ପୂର୍ବେ ପ୍ରତିଷ୍ଠିତ ଏହି ଗ୍ରାମ ଏକ ଛୋଟ କୃଷି ଜନବସତିରୁ ସହଯୋଗ ଏବଂ ସମାନ ପରମ୍ପରା ଉପରେ ନିର୍ମିତ ଏକ ଘନିଷ୍ଠ ସମ୍ପ୍ରଦାୟରେ ପରିଣତ ହୋଇଥିଲା।
              </p>

              <p className="text-black/70 text-base md:text-lg leading-relaxed">
                ପିଢ଼ି ପରେ ପିଢ଼ି ଧରି, ବଡ଼ପଥୁରିଆ ଦୃଢ଼ ସାଂସ୍କୃତିକ ମୂଳ ବିକଶିତ କରିଥିଲା। ପର୍ବପର୍ବାଣୀ, ଗ୍ରାମ ସମାବେଶ ଏବଂ ସାମୂହିକ କାର୍ଯ୍ୟ ପରିବାର ମଧ୍ୟରେ ଏକତାକୁ ସୁଦୃଢ଼ ​​କରିଥିଲା।
              </p>

              <p className="text-black/70 text-base md:text-lg leading-relaxed">
                ସମୟ ସହିତ, ଗ୍ରାମ ଶିକ୍ଷା, ଭିତ୍ତିଭୂମି ଏବଂ ସାର୍ବଜନୀନ ସେବାରେ ଧୀରେ ଧୀରେ ବିକାଶକୁ ଗ୍ରହଣ କରିଥିଲା।
              </p>

              <p className="text-black/80 font-bold text-base md:text-lg leading-relaxed bg-[#88AB8E]/5 p-6 rounded-2xl border-l-4 border-[#88AB8E]">
                ଆଜି, ବଡ଼ପଥୁରିଆ ସ୍ଥିରତା, ସହଯୋଗ ଏବଂ ସାଂସ୍କୃତିକ ଗର୍ବର ପ୍ରତୀକ ଭାବରେ ଠିଆ ହୋଇଛି।
              </p>

            </div>

          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#88AB8E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="absolute top-12 right-12 text-[#88AB8E]/10 opacity-20 pointer-events-none hidden md:block">

            <ScrollText size={200} />

          </div>

        </div>

      </section>


      {/* =====================================================
          NOTICE BOARD
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">

          <div className="flex items-center gap-3">

            <div className="p-2 bg-[#88AB8E] text-white rounded-xl">

              <Megaphone size={20} />

            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Recent Notices
            </h2>

          </div>

          <Link
            to="/notices"
            className="text-[#88AB8E] font-bold text-sm flex items-center gap-1 hover:underline underline-offset-4"
          >
            View All Board
            <ChevronRight size={16} />
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {notices.slice(0, 4).map((notice) => (

            <Link
              to="/notices"
              key={notice.id}
              className="bg-white p-6 rounded-[32px] border border-[#88AB8E]/10 shadow-lg shadow-black/5 hover:border-[#88AB8E]/40 transition-all group"
            >

              <div className="flex items-center gap-2 mb-3">

                <span className="bg-[#88AB8E]/10 text-[#88AB8E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {notice.category}
                </span>

                <span className="text-[10px] text-black/40 font-bold flex items-center gap-1">

                  <Calendar size={12} />

                  {notice.date}

                </span>

              </div>

              <h4 className="text-lg font-bold text-black mb-2 group-hover:text-[#88AB8E] transition-colors">
                {notice.title}
              </h4>

              <p className="text-black/60 text-sm line-clamp-2 leading-relaxed">
                {notice.content}
              </p>

            </Link>

          ))}

        </div>

      </section>


      {/* =====================================================
          SERVICES PREVIEW
      ===================================================== */}

      <section className="bg-black py-20 md:py-32 mb-20 text-white overflow-hidden relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">

            <div className="max-w-2xl">

              <span className="text-[#88AB8E] font-bold uppercase tracking-[0.2em] text-sm block mb-4">
                Our Services
              </span>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for Community Support
              </h2>

              <p className="text-white/60 text-lg">
                Access essential village infrastructure and government support systems designed to help every resident thrive.
              </p>

            </div>

            <Link
              to="/services"
              className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2 w-fit"
            >
              View All Services
              <ArrowRight size={18} />
            </Link>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                icon: <School size={32} />,
                title: 'Education',
                desc: 'Primary and secondary schools serving our children.'
              },
              {
                icon: <HeartPulse size={32} />,
                title: 'Healthcare',
                desc: 'PHC centers and emergency medical support.'
              },
              {
                icon: <Store size={32} />,
                title: 'Local Economy',
                desc: 'Supporting local businesses and agriculture.'
              }
            ].map((s, i) => (

              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:bg-white/10 transition-all backdrop-blur-sm"
              >

                <div className="text-[#88AB8E] mb-6">
                  {s.icon}
                </div>

                <h4 className="text-2xl font-bold mb-3">
                  {s.title}
                </h4>

                <p className="text-white/40 leading-relaxed text-sm md:text-base">
                  {s.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#88AB8E]/5 rounded-full translate-x-1/2 -translate-y-1/2" />

      </section>


      {/* =====================================================
          GALLERY
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">

        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-3">

            <div className="p-2 bg-[#88AB8E] text-white rounded-xl">

              <Camera size={20} />

            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Village Snapshots
            </h2>

          </div>

          <Link
            to="/gallery"
            className="text-[#88AB8E] font-bold text-sm flex items-center gap-1 hover:underline"
          >
            Explore Gallery
            <ChevronRight size={16} />
          </Link>

        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar scroll-smooth snap-x snap-mandatory">

          {gallery.slice(0, 6).map((img) => (

            <Link
              key={img.id}
              to="/gallery"
              className="min-w-[280px] md:min-w-[350px] snap-center group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-lg border border-[#88AB8E]/10 hover:scale-[1.02] transition-transform"
            >

              <div className="aspect-video overflow-hidden">

                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

              </div>

              <div className="p-5">

                <h5 className="font-bold text-black group-hover:text-[#88AB8E] transition-colors line-clamp-1">
                  {img.title}
                </h5>

                <p className="text-[10px] md:text-xs text-black/50 line-clamp-2 mt-1">
                  {img.description}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">

        <div className="text-center mb-16">

          <span className="text-[#88AB8E] font-bold uppercase tracking-[0.2em] text-sm block mb-4">
            Resident Stories
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-black">
            What our Villagers say
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {reviews.slice(0, 3).map((review) => (

            <div
              key={review.id}
              className="bg-white p-8 rounded-[40px] shadow-xl shadow-black/5 border border-[#88AB8E]/5 relative group hover:scale-[1.02] transition-all"
            >

              <div className="absolute top-8 right-8 text-[#88AB8E]/10">

                <Quote size={48} />

              </div>

              <div className="flex items-center gap-4 mb-6">

                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#88AB8E]/20">

                  <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />

                </div>

                <div>

                  <h4 className="font-bold text-black">
                    {review.name}
                  </h4>

                  <div className="flex gap-0.5 mt-1">

                    {[...Array(5)].map((_, i) => (

                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? 'text-yellow-500'
                            : 'text-gray-200'
                        }
                        fill={
                          i < review.rating
                            ? 'currentColor'
                            : 'none'
                        }
                      />

                    ))}

                  </div>

                </div>

              </div>

              <p className="text-black/70 leading-relaxed italic text-sm">
                "{review.content}"
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          MAP
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        <div className="bg-white rounded-[40px] p-4 shadow-xl border border-[#88AB8E]/10 overflow-hidden">

          <div className="p-6 flex items-center justify-between flex-wrap gap-4">

            <div className="flex items-center gap-3">

              <div className="p-2 bg-[#88AB8E] text-white rounded-xl">

                <MapPin size={24} />

              </div>

              <div>

                <h3 className="text-xl md:text-2xl font-bold text-black">
                  Our Location
                </h3>

                <p className="text-xs md:text-sm text-black/50">
                  📍 Badapathuria Village,pin-752064, Odisha
                </p>

              </div>

            </div>

            <button
              className="bg-[#F9F8F4] text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Get Directions
            </button>

          </div>

          <div className="relative rounded-[32px] overflow-hidden h-[350px] md:h-[450px]">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13559.64221350307!2d85.38990019288322!3d20.135169797186936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a185a53eca68429%3A0xfd70ebae457695bb!2sBadapathuria%2C%20Odisha!5e1!3m2!1sen!2sin!4v1771049415142!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

        </div>

      </section>

    </div>

  );
};

export default HomePage;