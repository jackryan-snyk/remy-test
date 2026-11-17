package com.example.todo;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.commons.collections.CollectionUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * In-memory todo store. Touches c3p0 and commons-collections so both
 * dependencies are genuinely used and an upgrade has to keep compiling.
 */
public class TodoStore {

    private final List<String> items = new ArrayList<>();

    public void add(String item) {
        if (item == null || item.isBlank()) {
            throw new IllegalArgumentException("item must not be blank");
        }
        items.add(item.trim());
    }

    public List<String> all() {
        return List.copyOf(items);
    }

    /** Items present in both this store and the other collection. */
    @SuppressWarnings("unchecked")
    public Collection<String> overlap(Collection<String> other) {
        return CollectionUtils.intersection(items, other);
    }

    /** Builds a pool config without opening a connection. */
    public static ComboPooledDataSource poolConfig(String jdbcUrl, int maxPoolSize) {
        ComboPooledDataSource ds = new ComboPooledDataSource();
        ds.setJdbcUrl(jdbcUrl);
        ds.setMaxPoolSize(maxPoolSize);
        return ds;
    }
}
