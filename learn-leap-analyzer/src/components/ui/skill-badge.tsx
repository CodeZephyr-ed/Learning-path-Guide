import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SkillBadgeProps {
  skill: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  className?: string;
}

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

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  proficiency,
  className,
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm font-medium text-foreground">{skill}</span>
      <Badge className={cn('text-xs', proficiencyColors[proficiency])}>
        {proficiencyLabels[proficiency]}
      </Badge>
    </div>
  );
};