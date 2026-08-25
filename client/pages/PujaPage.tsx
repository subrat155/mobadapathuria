import React from 'react';
import {
  IndianRupee,
  HandCoins,
  WalletCards,
  User,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

const PujaPage: React.FC = () => {

  const { pujas } = useApp();

  const totalAmount = pujas.reduce(
    (total, puja) => total + Number(puja.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F9F8F4] py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#88AB8E] hover:text-[#6B8A7A] mb-6"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

            <div>
              <span className="text-[#88AB8E] text-xs font-bold uppercase tracking-[0.2em]">
                Village Community
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-black mt-2">
                Puja Contributions
              </h1>

              <p className="text-black/50 mt-3">
                Complete list of village puja contributions.
              </p>
            </div>

            {/* TOTALS */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-white rounded-2xl px-6 py-4 border border-[#88AB8E]/10 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                  Contributors
                </p>

                <p className="text-2xl font-bold text-black mt-1">
                  {pujas.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl px-6 py-4 border border-[#88AB8E]/10 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                  Total Amount
                </p>

                <p className="text-2xl font-bold text-[#88AB8E] mt-1 flex items-center gap-1">
                  <IndianRupee size={20} />
                  {totalAmount.toLocaleString('en-IN')}
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* TABLE */}
        <div className="bg-white rounded-[32px] border border-[#88AB8E]/10 shadow-xl shadow-black/5 overflow-hidden">

          {/* TABLE HEADER */}
          <div className="p-6 md:p-8 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="p-3 bg-[#88AB8E]/10 rounded-xl">
                <HandCoins
                  size={22}
                  className="text-[#88AB8E]"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-black">
                  Contribution Records
                </h2>

                <p className="text-xs text-black/40 mt-1">
                  {pujas.length} total entries
                </p>
              </div>

            </div>

          </div>


          {pujas.length === 0 ? (

            /* EMPTY STATE */
            <div className="py-24 text-center">

              <HandCoins
                size={48}
                className="mx-auto text-[#88AB8E]/30 mb-4"
              />

              <h3 className="font-bold text-black text-lg">
                No Puja Contributions
              </h3>

              <p className="text-sm text-black/40 mt-2">
                No puja contribution has been recorded yet.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">

                <thead>
                  <tr className="bg-[#F9F8F4] border-b border-gray-100">

                    <th className="text-left px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-black/40">
                      #
                    </th>

                    <th className="text-left px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-black/40">
                      Puja Name
                    </th>

                    <th className="text-left px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-black/40">
                      Member
                    </th>

                    <th className="text-left px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-black/40">
                      Amount
                    </th>

                    <th className="text-left px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-black/40">
                      Payment Mode
                    </th>

                    <th className="text-left px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-black/40">
                      Date
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {pujas.map((puja, index) => (

                    <tr
                      key={puja.id}
                      className="border-b border-gray-100 hover:bg-[#88AB8E]/5 transition-colors"
                    >

                      {/* NUMBER */}
                      <td className="px-6 py-5">

                        <span className="w-8 h-8 rounded-lg bg-[#88AB8E]/10 text-[#88AB8E] flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>

                      </td>


                      {/* PUJA NAME */}
                      <td className="px-6 py-5">

                        <div className="font-bold text-black">
                          {puja.pujaName}
                        </div>

                      </td>


                      {/* MEMBER */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <div className="w-9 h-9 rounded-full bg-[#88AB8E]/10 flex items-center justify-center">
                            <User
                              size={16}
                              className="text-[#88AB8E]"
                            />
                          </div>

                          <span className="font-medium text-black/70">
                            {puja.memberName}
                          </span>

                        </div>

                      </td>


                      {/* AMOUNT */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-1 font-bold text-black">

                          <IndianRupee size={15} />

                          {Number(
                            puja.amount
                          ).toLocaleString('en-IN')}

                        </div>

                      </td>


                      {/* PAYMENT MODE */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                            puja.paymentMode === 'Cash'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >

                          {puja.paymentMode === 'Cash' ? (
                            <HandCoins size={14} />
                          ) : (
                            <WalletCards size={14} />
                          )}

                          {puja.paymentMode}

                        </span>

                      </td>


                      {/* DATE */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-black/50">

                          <Calendar size={15} />

                          {puja.date || '—'}

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default PujaPage;