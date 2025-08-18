import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const proficiencyColors = {
  beginner: 'bg-muted text-muted-foreground',
  intermediate: 'bg-warning text-warning-foreground',
  advanced: 'bg-primary text-primary-foreground',
  expert: 'bg-success text-success-foreground',
};

const proficiencyLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

export const SkillBadge = ({ skill, proficiency, className }) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm font-medium text-foreground">{skill}</span>
      <Badge 
        className={cn('text-xs', proficiencyColors[proficiency])}
        aria-label={`${proficiencyLabels[proficiency]} proficiency`}
      >
        {proficiencyLabels[proficiency]}
      </Badge>
    </div>
  );
};
