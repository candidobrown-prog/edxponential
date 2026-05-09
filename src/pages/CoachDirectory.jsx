import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CoachDirectoryCard from '../components/coaching/CoachDirectoryCard';

export default function CoachDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Fetch coaches (reusing existing coaching data)
  const { data: coaches = [], isLoading } = useQuery({
    queryKey: ['coaches-directory'],
    queryFn: async () => {
      try {
        const sessions = await base44.entities.CoachingSession.list('-created_date', 500);
        
        // Deduplicate coaches and build coach objects
        const coachMap = new Map();
        sessions.forEach(session => {
          if (session.coach_email && !coachMap.has(session.coach_email)) {
            coachMap.set(session.coach_email, {
              id: session.coach_email,
              name: session.coach_name,
              email: session.coach_email,
              title: session.coach_title || 'Coach',
              specializations: session.specializations ? 
                (typeof session.specializations === 'string' ? JSON.parse(session.specializations) : session.specializations) 
                : [],
              rating: session.coach_rating || 4.5,
              reviews_count: session.coach_reviews || 0,
              rate_per_session: session.rate || 150,
              is_available: session.coach_availability !== 'unavailable',
              next_available: session.next_availability || 'This week',
              bio: session.coach_bio || '',
              photo_url: session.coach_photo || '',
            });
          }
        });
        
        return Array.from(coachMap.values());
      } catch (error) {
        console.error('Error fetching coaches:', error);
        return [];
      }
    },
  });

  // Get unique specializations for filter
  const specializations = useMemo(() => {
    const specs = new Set();
    coaches.forEach(coach => {
      if (coach.specializations && Array.isArray(coach.specializations)) {
        coach.specializations.forEach(spec => specs.add(spec));
      }
    });
    return Array.from(specs).sort();
  }, [coaches]);

  // Filter coaches
  const filteredCoaches = useMemo(() => {
    return coaches.filter(coach => {
      // Search filter
      const matchSearch = !searchTerm || 
        coach.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      // Specialization filter
      const matchSpecialization = selectedSpecialization === 'all' ||
        coach.specializations?.includes(selectedSpecialization);

      // Rating filter
      const matchRating = selectedRating === 'all' ||
        (selectedRating === '4plus' && coach.rating >= 4) ||
        (selectedRating === '4.5plus' && coach.rating >= 4.5) ||
        (selectedRating === '5' && coach.rating === 5);

      // Availability filter
      const matchAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && coach.is_available) ||
        (availabilityFilter === 'unavailable' && !coach.is_available);

      // Price range filter
      const rate = coach.rate_per_session || 0;
      const matchPrice = priceRange === 'all' ||
        (priceRange === '0-100' && rate <= 100) ||
        (priceRange === '100-200' && rate > 100 && rate <= 200) ||
        (priceRange === '200plus' && rate > 200);

      return matchSearch && matchSpecialization && matchRating && matchAvailability && matchPrice;
    });
  }, [coaches, searchTerm, selectedSpecialization, selectedRating, availabilityFilter, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('all');
    setSelectedRating('all');
    setAvailabilityFilter('all');
    setPriceRange('all');
  };

  const hasActiveFilters = searchTerm || selectedSpecialization !== 'all' || selectedRating !== 'all' || availabilityFilter !== 'all' || priceRange !== 'all';

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Link to="/coaching" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1">
          ← Back to Coaching
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Find Your Coach</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse vetted coaches specializing in leadership development, strategic planning, and executive coaching.
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialization..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 rounded-xl h-11"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">⭐ 5.0</SelectItem>
              <SelectItem value="4.5plus">⭐ 4.5+</SelectItem>
              <SelectItem value="4plus">⭐ 4.0+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available Now</SelectItem>
              <SelectItem value="unavailable">Coming Soon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="0-100">$0 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="200plus">$200+</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchTerm && <Badge variant="secondary">{searchTerm} <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>}
            {selectedSpecialization !== 'all' && <Badge variant="secondary">{selectedSpecialization} <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>}
            {selectedRating !== 'all' && <Badge variant="secondary">Rating: {selectedRating} <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>}
            {availabilityFilter !== 'all' && <Badge variant="secondary">{availabilityFilter} <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>}
            {priceRange !== 'all' && <Badge variant="secondary">Price: {priceRange} <X className="w-3 h-3 ml-1 cursor-pointer" /></Badge>}
          </div>
        )}
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-border border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading coaches...</p>
          </div>
        ) : filteredCoaches.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No coaches match your filters.</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-4 rounded-xl"
            >
              Clear Filters & Try Again
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredCoaches.length} coach{filteredCoaches.length !== 1 ? 'es' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoaches.map((coach, i) => (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CoachDirectoryCard coach={coach} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}