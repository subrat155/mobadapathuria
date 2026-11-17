import React, { useState } from 'react';
import { useApp, Family } from '../AppContext';
import { Users, Phone, Briefcase, User, Search, Filter, X, IdCard } from 'lucide-react';
import { Villager } from '../types';
import FamilyQrCard from '../components/FamilyQrCard';

const findFamilyForVillager = (families: Family[], villager: Villager): Family | null => {
  const name = villager.name.trim().toLowerCase();
  const matches = families.filter(
    (family) => family.familyHead.trim().toLowerCase() === name
  );

  return matches.find((family) => family.status === 'Active') || matches[0] || null;
};

const DirectoryPage: React.FC = () => {
  const { villagers, families } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Villager | null>(null);

  const filteredVillagers = villagers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.occupation.toLowerCase().includes(search.toLowerCase())
  );

  const selectedFamily = selected ? findFamilyForVillager(families, selected) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#88AB8E]/10 text-[#88AB8E] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Users size={14} />
          Community Connect
        </div>
        <h1 className="text-5xl font-bold text-black mb-4">Villagers Directory</h1>
        <p className="text-black/60 max-w-2xl mx-auto text-lg leading-relaxed">
          A voluntary directory to help villagers connect, support each other, and grow the local economy together.
        </p>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl border border-[#88AB8E]/10 overflow-hidden mb-12">
        <div className="p-6 md:p-8 bg-[#88AB8E]/5 border-b border-[#88AB8E]/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or occupation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#88AB8E]/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#88AB8E]/30 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all border border-[#88AB8E]/20">
            <Filter size={18} /> Filter List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#88AB8E]/5">
                <th className="px-8 py-6 text-xs font-bold text-black/40 uppercase tracking-widest">Villager</th>
                <th className="px-8 py-6 text-xs font-bold text-black/40 uppercase tracking-widest">View Profile</th>
                <th className="px-8 py-6 text-xs font-bold text-black/40 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-6 text-xs font-bold text-black/40 uppercase tracking-widest">Occupation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVillagers.map((villager) => (
                <tr key={villager.id} className="hover:bg-[#F9F8F4] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#88AB8E]/10 flex items-center justify-center text-[#88AB8E]">
                        <User size={24} />
                      </div>
                      <span className="font-bold text-black">{villager.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="view-profile-wrap">
                      <button
                        type="button"
                        onClick={() => setSelected(villager)}
                        className="view-profile-pulse rounded-xl bg-[#E8F0E9] px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-[#DCE9DE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#557B5D]"
                      >
                        View Profile
                      </button>
                      <span className="view-profile-wave" aria-hidden="true">
                        <span className="view-profile-wave-particle" />
                        <span className="view-profile-wave-particle" />
                      </span>
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-black/50">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#88AB8E]" />
                      {villager.contact || 'Not shared'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-black/70">
                      <Briefcase size={16} />
                      {villager.occupation}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVillagers.length === 0 && (
             <div className="p-20 text-center text-gray-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                No villagers found matching your search.
             </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 flex items-stretch sm:items-center justify-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="villager-profile-title"
            className="bg-white w-full h-full sm:h-auto sm:max-h-[92dvh] sm:max-w-4xl overflow-y-auto rounded-none sm:rounded-[28px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white border-b border-[#88AB8E]/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[#88AB8E]">Villager Profile</p>
                <h2 id="villager-profile-title" className="text-xl sm:text-2xl font-black text-black truncate">{selected.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-shrink-0 inline-flex items-center gap-2 p-2 sm:px-3 rounded-xl hover:bg-gray-100 text-black/70"
                aria-label="Back to directory"
                title="Back to directory"
              >
                <X size={22} />
                <span className="hidden sm:inline text-sm font-bold">Back to Directory</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {selectedFamily ? (
                <div className="flex justify-center rounded-3xl border border-[#88AB8E]/20 bg-[#F9F8F4] p-4 sm:p-5">
                  <FamilyQrCard
                    family={selectedFamily}
                    onClose={() => setSelected(null)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 px-4 py-4">
                  <IdCard size={32} className="flex-shrink-0 text-gray-300" />
                  <p className="flex-1 text-left font-bold text-gray-600">
                    No Family QR ID registered for {selected.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                    aria-label="Close profile and return to directory"
                    title="Back to directory"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F9F8F4] rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase text-black/40">Occupation</p>
                  <p className="font-semibold mt-1">{selected.occupation || 'Not shared'}</p>
                </div>
                <div className="bg-[#F9F8F4] rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase text-black/40">Contact</p>
                  <p className="font-semibold mt-1">{selected.contact || 'Not shared'}</p>
                </div>
              </div>

              {selectedFamily ? (
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 bg-[#88AB8E]/10 text-[#557B5D] px-3 py-1.5 rounded-full text-sm font-black">
                        <IdCard size={16} />
                        {selectedFamily.familyId}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          selectedFamily.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {selectedFamily.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black mb-3">Family Member Details</h3>
                      {selectedFamily.members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedFamily.members.map((member, index) => (
                            <div key={member._id || index} className="min-w-0 border border-gray-100 rounded-2xl p-4 space-y-2">
                              <p className="font-bold break-words">{member.name}</p>
                              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-black/60">
                                <dt>Relation</dt>
                                <dd className="break-words">{member.relation || '—'}</dd>
                                <dt>Age</dt>
                                <dd>{member.age ?? '—'}</dd>
                                <dt>Gender</dt>
                                <dd>{member.gender || '—'}</dd>
                              </dl>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 border border-gray-100 rounded-2xl p-4">
                          No members recorded.
                        </p>
                      )}
                    </div>
                  </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
