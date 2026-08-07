// Re-exports the shared PageHeader so existing imports keep working.
// The agent dashboard uses showDepartmentChip={false}.
import PageHeader from './layout/PageHeader';

export default function Header() {
  return <PageHeader showDepartmentChip={false} />;
}