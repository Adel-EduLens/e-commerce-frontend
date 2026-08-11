import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Search,
  Download,
  Users,
  Vote,
  Calendar,
  Mail,
  Phone,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { useDesignVotes, type DesignVoter } from '../../../hooks/queries/designsQuery';
import { toast } from 'sonner';

export default function TraderDesignVotesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('traderDesigns');
  const isRTL = i18n.language?.startsWith('ar');

  const { data, isLoading, isError } = useDesignVotes(id);
  const [searchTerm, setSearchTerm] = useState('');

  const design = data?.design;
  const voters = data?.voters || [];

  const filteredVoters = useMemo(() => {
    return voters.filter((voter: DesignVoter) => {
      return (
        voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (voter.phone && voter.phone.includes(searchTerm))
      );
    });
  }, [voters, searchTerm]);

  const handleExportCSV = () => {
    if (filteredVoters.length === 0) {
      toast.error(t('noVotersFound', 'No voters to export'));
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += `"${t('voterName', 'Voter Name')}","${t('voterEmail', 'Email Address')}","${t(
      'voterPhone',
      'Phone'
    )}","${t('votedAt', 'Date & Time')}"\n`;

    filteredVoters.forEach((v) => {
      const name = (v.name || '').replace(/"/g, '""');
      const email = (v.email || '').replace(/"/g, '""');
      const phone = (v.phone || '').replace(/"/g, '""');
      const date = new Date(v.votedAt).toLocaleString();

      csvContent += `"${name}","${email}","${phone}","${date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `design_votes_${id || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Voters list exported successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !design) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">
          {t('designNotFound', 'Design not found or failed to load.')}
        </p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/trader/designs')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('backToDesigns', 'Back to Designs')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/trader/designs')}
            aria-label={t('backToDesigns', 'Back to Designs')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stroke bg-card text-foreground shadow-sm transition hover:bg-stroke/30 hover:border-primary/40 cursor-pointer"
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h1 className="font-['Montserrat'] text-xl font-bold text-foreground sm:text-2xl">
              {t('votesDetailsTitle', 'Design Votes & Voters')}
            </h1>
            <p className="text-xs text-gray-text sm:text-sm">
              {t('votesDetailsSubtitle', 'Review detailed voting activity and voter information for this design.')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-stroke bg-card px-4 py-2.5 font-['Montserrat'] text-xs font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>{t('exportCSV', 'Export Voters (CSV)')}</span>
        </button>
      </div>

      {/* Compact Overview Bar: Design Preview & Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-stroke bg-card p-4 shadow-sm">
        {/* Left: Compact Design Preview & Description */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <img
            src={design.imagePath}
            alt={design.description}
            className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl object-cover border border-stroke/80 shadow-sm"
          />
          <div className="min-w-0">
            <p className="font-['Montserrat'] text-sm font-semibold text-foreground line-clamp-2 leading-snug">
              {design.description}
            </p>
            <p className="mt-0.5 text-xs text-gray-text">ID: #{design.id.slice(-8)}</p>
          </div>
        </div>

        {/* Right: Single Compact Total Votes Chip */}
        <div className="flex items-center shrink-0 self-stretch md:self-auto">
          <div className="flex items-center gap-2.5 rounded-xl border border-stroke bg-background px-4 py-2 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Vote className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-text">{t('totalVotes', 'Total Votes')}</p>
              <p className="font-['Montserrat'] text-base font-bold text-foreground leading-tight">{voters.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Voters List Table Section */}
      <section className="space-y-4 rounded-[24px] border border-stroke bg-card p-5 shadow-sm">
        {/* Controls: Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-['Montserrat'] text-base font-bold text-foreground sm:text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <span>{t('votersList', 'Voters List')}</span>
            <span className="rounded-full bg-stroke/40 px-2.5 py-0.5 text-xs font-semibold text-gray-text">
              {filteredVoters.length}
            </span>
          </h2>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-text" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchVotersPlaceholder', 'Search voters by name or email...')}
              className="w-full rounded-xl border border-stroke bg-background py-2 pl-9 pr-3 font-['Montserrat'] text-xs font-medium text-foreground outline-none transition focus:border-primary placeholder:text-gray-text"
            />
          </div>
        </div>

        {/* Table Content */}
        {filteredVoters.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Users className="h-10 w-10 text-gray-text/60" />
            <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
              {searchTerm
                ? t('noVotersFound', 'No voters found matching active filter.')
                : t('noVotesYet', 'No votes have been cast for this design yet.')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
              <thead>
                <tr className="border-b border-stroke bg-background/80">
                  <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                    {t('voterName', 'Voter')}
                  </th>
                  <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                    {t('voterEmail', 'Email Address')}
                  </th>
                  <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                    {t('voterPhone', 'Phone')}
                  </th>
                  <th className="px-4 py-3 text-start font-['Montserrat'] text-xs font-semibold text-gray-text">
                    {t('votedAt', 'Date & Time')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.map((voter, index) => {
                  const initials = (voter.name || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  const voteDate = new Date(voter.votedAt);
                  const formattedDate = !isNaN(voteDate.getTime())
                    ? voteDate.toLocaleDateString() + ' ' + voteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : voter.votedAt;

                  return (
                    <tr
                      key={voter.id}
                      className={
                        index % 2 === 0
                          ? 'bg-card hover:bg-background/60 transition-colors'
                          : 'bg-background/40 hover:bg-background/80 transition-colors'
                      }
                    >
                      {/* Name & Avatar */}
                      <td className="px-4 py-3.5 text-start text-sm font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/80 font-bold text-foreground shadow-sm">
                            <span className="text-xs">{initials}</span>
                          </div>
                          <div>
                            <p className="font-['Montserrat'] text-sm font-semibold text-foreground">
                              {voter.name || t('anonymousUser', 'User')}
                            </p>
                            <p className="text-xs text-gray-text">ID: #{voter.userId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-start text-sm text-foreground">
                        <div className="flex items-center gap-1.5 text-gray-text hover:text-foreground transition">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{voter.email || '—'}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 text-start text-sm text-foreground">
                        <div className="flex items-center gap-1.5 text-gray-text">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{voter.phone || '—'}</span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3.5 text-start text-xs text-gray-text font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
